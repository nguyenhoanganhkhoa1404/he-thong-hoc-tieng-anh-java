package com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.service;

import com.englishwebsite.EnglishWebsite.common.firestore.FirestoreMapper;
import com.google.cloud.firestore.*;
import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.GrammarLessonDto;
import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.PlacementTestResultDto;
import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.VocabularyItemDto;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Service Nhóm 2 – Placement & Vocabulary & Grammar.
 *
 * Lưu/đọc dữ liệu từ Firestore.
 */
@Service
public class VocabularyGrammarService {

    // Prefer existing production collections first, then legacy fallback names.
    private static final List<String> COL_VOCAB = List.of("vocabulary", "vocabularyItems");
    private static final List<String> COL_GRAMMAR = List.of("grammarLessons", "grammar_Lessons");
    private static final List<String> COL_PLACEMENT = List.of("placementTests", "placement_tests");
    private static final List<String> COL_VOCAB_PROGRESS = List.of("user_vocabulary_progress", "userVocabularyProgress");
    private static final List<String> COL_GRAMMAR_PROGRESS = List.of("user_grammar_progress", "userGrammarProgress");

    private final Firestore firestore;
    private final FirestoreMapper mapper;

    public VocabularyGrammarService(Firestore firestore, FirestoreMapper mapper) {
        this.firestore = firestore;
        this.mapper = mapper;
    }

    @PostConstruct
    public void seedIfEmpty() {
        try {
            CollectionReference vocabCol = firstWritableCollection(COL_VOCAB);
            CollectionReference grammarCol = firstWritableCollection(COL_GRAMMAR);

            // Force seed demo data to ensure proper schema
            vocabCol.document("V-001")
                    .set(new VocabularyItemDto("V-001", "travel", "du lịch", "I love travel.", "travel", "A1", false));
            vocabCol.document("V-002")
                    .set(new VocabularyItemDto("V-002", "appointment", "cuộc hẹn", "I have an appointment at 3 PM.", "business", "A2", false));
            
            grammarCol.document("G-001")
                    .set(new GrammarLessonDto("G-001", "Present Simple", "Diễn tả thói quen / sự thật.", "tenses", "A1", false));
            grammarCol.document("G-002")
                    .set(new GrammarLessonDto("G-002", "Past Simple", "Diễn tả hành động đã xảy ra.", "tenses", "A2", false));
        } catch (Exception ignored) {
            // nếu môi trường chưa cấu hình Firestore, không crash app lúc start
        }
    }

    public PlacementTestResultDto submitPlacementTest(String userId, Integer score) {
        String uid = userId != null ? userId : "user-demo";
        int s = score != null ? Math.max(0, Math.min(100, score)) : 0;
        String level = mapScoreToLevel(s);

        Map<String, Object> doc = new HashMap<>();
        doc.put("userId", uid);
        doc.put("score", s);
        doc.put("level", level);
        doc.put("createdAt", LocalDateTime.now().toString());

        try {
            firstWritableCollection(COL_PLACEMENT).document(uid).set(doc).get();
        } catch (Exception ignored) {
        }

        return new PlacementTestResultDto(uid, s, level, "Placement test submitted.");
    }

    public List<VocabularyItemDto> listVocabulary(String userId, String topic, String level) {
        String uid = userId != null ? userId : "user-demo";
        Set<String> learned = loadLearnedVocabIds(uid);
        try {
            Map<String, VocabularyItemDto> merged = new LinkedHashMap<>();
            for (String col : COL_VOCAB) {
                QuerySnapshot snap = firestore.collection(col).get().get();
                for (DocumentSnapshot d : snap.getDocuments()) {
                    try {
                        VocabularyItemDto item = mapper.fromMap(d.getData(), VocabularyItemDto.class);
                        if (item == null) continue;
                        if (item.getId() == null || item.getId().isBlank()) item.setId(d.getId());
                        if (!matches(item.getTopic(), topic) || !matches(item.getLevel(), level)) continue;
                        item.setLearned(learned.contains(item.getId()));
                        merged.putIfAbsent(item.getId(), item);
                    } catch (Exception ignored) {
                        // Skip malformed documents to avoid dropping the whole response.
                        System.err.println("Error parsing document " + d.getId() + ": " + ignored.getMessage());
                    }
                }
            }
            List<VocabularyItemDto> list = new ArrayList<>(merged.values());
            list.sort(Comparator.comparing(VocabularyItemDto::getId));
            return list;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public VocabularyItemDto markVocabularyLearned(String userId, String vocabId, boolean learned) {
        String uid = userId != null ? userId : "user-demo";
        try {
            DocumentSnapshot vocabDoc = null;
            for (String col : COL_VOCAB) {
                DocumentSnapshot candidate = firestore.collection(col).document(vocabId).get().get();
                if (candidate.exists()) {
                    vocabDoc = candidate;
                    break;
                }
            }
            if (vocabDoc == null || !vocabDoc.exists()) return null;

            Map<String, Object> progress = new HashMap<>();
            progress.put("learned", learned);
            progress.put("updatedAt", LocalDateTime.now().toString());
            progress.put("userId", uid);
            progress.put("vocabId", vocabId);

            for (String col : COL_VOCAB_PROGRESS) {
                // Nested structure: /{collection}/{uid}/items/{vocabId}
                firestore.collection(col)
                        .document(uid)
                        .collection("items")
                        .document(vocabId)
                        .set(progress, SetOptions.merge())
                        .get();
                // Flat structure: /{collection}/{uid}_{vocabId}
                firestore.collection(col)
                        .document(uid + "_" + vocabId)
                        .set(progress, SetOptions.merge())
                        .get();
            }

            VocabularyItemDto item = mapper.fromMap(vocabDoc.getData(), VocabularyItemDto.class);
            if (item.getId() == null || item.getId().isBlank()) item.setId(vocabId);
            item.setLearned(learned);
            return item;
        } catch (Exception e) {
            return null;
        }
    }

    public List<GrammarLessonDto> listGrammarLessons(String userId, String topic, String level) {
        String uid = userId != null ? userId : "user-demo";
        Set<String> completed = loadCompletedGrammarIds(uid);
        try {
            Map<String, GrammarLessonDto> merged = new LinkedHashMap<>();
            for (String col : COL_GRAMMAR) {
                QuerySnapshot snap = firestore.collection(col).get().get();
                for (DocumentSnapshot d : snap.getDocuments()) {
                    try {
                        GrammarLessonDto lesson = mapper.fromMap(d.getData(), GrammarLessonDto.class);
                        if (lesson == null) continue;
                        if (lesson.getId() == null || lesson.getId().isBlank()) lesson.setId(d.getId());
                        if (!matches(lesson.getTopic(), topic) || !matches(lesson.getLevel(), level)) continue;
                        lesson.setCompleted(completed.contains(lesson.getId()));
                        merged.putIfAbsent(lesson.getId(), lesson);
                    } catch (Exception ignored) {
                        // Skip malformed documents to avoid dropping the whole response.
                    }
                }
            }
            List<GrammarLessonDto> list = new ArrayList<>(merged.values());
            list.sort(Comparator.comparing(GrammarLessonDto::getId));
            return list;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public GrammarLessonDto markGrammarCompleted(String userId, String lessonId, boolean completed) {
        String uid = userId != null ? userId : "user-demo";
        try {
            DocumentSnapshot lessonDoc = null;
            for (String col : COL_GRAMMAR) {
                DocumentSnapshot candidate = firestore.collection(col).document(lessonId).get().get();
                if (candidate.exists()) {
                    lessonDoc = candidate;
                    break;
                }
            }
            if (lessonDoc == null || !lessonDoc.exists()) return null;
            Map<String, Object> progress = new HashMap<>();
            progress.put("completed", completed);
            progress.put("updatedAt", LocalDateTime.now().toString());
            progress.put("userId", uid);
            progress.put("lessonId", lessonId);

            for (String col : COL_GRAMMAR_PROGRESS) {
                firestore.collection(col)
                        .document(uid)
                        .collection("items")
                        .document(lessonId)
                        .set(progress, SetOptions.merge())
                        .get();
                firestore.collection(col)
                        .document(uid + "_" + lessonId)
                        .set(progress, SetOptions.merge())
                        .get();
            }

            GrammarLessonDto lesson = mapper.fromMap(lessonDoc.getData(), GrammarLessonDto.class);
            if (lesson.getId() == null || lesson.getId().isBlank()) lesson.setId(lessonId);
            lesson.setCompleted(completed);
            return lesson;
        } catch (Exception e) {
            return null;
        }
    }

    private Set<String> loadLearnedVocabIds(String userId) {
        Set<String> ids = new HashSet<>();
        try {
            for (String col : COL_VOCAB_PROGRESS) {
                // Nested structure
                QuerySnapshot nested = firestore.collection(col)
                        .document(userId)
                        .collection("items")
                        .whereEqualTo("learned", true)
                        .get()
                        .get();
                for (DocumentSnapshot d : nested.getDocuments()) ids.add(d.getId());

                // Flat structure
                QuerySnapshot flat = firestore.collection(col)
                        .whereEqualTo("userId", userId)
                        .whereEqualTo("learned", true)
                        .get()
                        .get();
                for (DocumentSnapshot d : flat.getDocuments()) {
                    String vocabId = valueOrDocId(d, "vocabId", "vocabularyId", "itemId", "id");
                    ids.add(vocabId);
                }
            }
        } catch (Exception e) {
            // ignore and return best-effort ids collected so far
        }
        return ids;
    }

    private Set<String> loadCompletedGrammarIds(String userId) {
        Set<String> ids = new HashSet<>();
        try {
            for (String col : COL_GRAMMAR_PROGRESS) {
                QuerySnapshot nested = firestore.collection(col)
                        .document(userId)
                        .collection("items")
                        .whereEqualTo("completed", true)
                        .get()
                        .get();
                for (DocumentSnapshot d : nested.getDocuments()) ids.add(d.getId());

                QuerySnapshot flat = firestore.collection(col)
                        .whereEqualTo("userId", userId)
                        .whereEqualTo("completed", true)
                        .get()
                        .get();
                for (DocumentSnapshot d : flat.getDocuments()) {
                    String lessonId = valueOrDocId(d, "lessonId", "grammarId", "itemId", "id");
                    ids.add(lessonId);
                }
            }
        } catch (Exception e) {
            // ignore and return best-effort ids collected so far
        }
        return ids;
    }

    private boolean hasAnyDocuments(List<String> collections) throws Exception {
        for (String name : collections) {
            if (!firestore.collection(name).limit(1).get().get().isEmpty()) return true;
        }
        return false;
    }

    private CollectionReference firstWritableCollection(List<String> collections) {
        return firestore.collection(collections.get(0));
    }

    private boolean matches(String value, String filter) {
        if (filter == null || filter.isBlank()) return true;
        return value != null && value.equalsIgnoreCase(filter.trim());
    }

    private String valueOrDocId(DocumentSnapshot d, String... keys) {
        Map<String, Object> data = d.getData();
        if (data != null) {
            for (String key : keys) {
                Object val = data.get(key);
                if (val != null && !String.valueOf(val).isBlank()) return String.valueOf(val);
            }
        }
        return d.getId();
    }

    private String mapScoreToLevel(int score) {
        if (score < 20) return "A1";
        if (score < 40) return "A2";
        if (score < 60) return "B1";
        if (score < 75) return "B2";
        if (score < 90) return "C1";
        return "C2";
    }
}

