package com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.service;

import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.*;
import com.google.cloud.firestore.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class VocabularyGrammarService {

    private static final Logger log = LoggerFactory.getLogger(VocabularyGrammarService.class);

    // Dùng Dependency Injection cực kỳ chuẩn bài
    private final Firestore db;

    // Bộ nhớ đệm (Cache) để tăng tốc Web
    private List<QuestionDto> cachedPlacementQuestions = null;
    private List<GrammarLessonDto> cachedGrammarLessons = null;

    // Spring Boot tự động Inject Bean Firestore vào đây
    public VocabularyGrammarService(Firestore db) {
        this.db = db;
    }

    // ======================================================
    // 1. HỌC TỪ VỰNG (RANDOM 5 TỪ TỪ FIRESTORE)
    // ======================================================
    public List<VocabularyItemDto> getVocabulary(String topic, String level) {
        List<VocabularyItemDto> allItems = new ArrayList<>();
        try {
            Query query = db.collection("vocabulary").whereEqualTo("level", level).limit(50);
            for (QueryDocumentSnapshot doc : query.get().get().getDocuments()) {
                allItems.add(new VocabularyItemDto(
                    doc.getId(), doc.getString("word"), doc.getString("meaning"),
                    doc.getString("example"), doc.getString("pronunciation"),
                    topic, level, false
                ));
            }

            if (!allItems.isEmpty()) {
                Collections.shuffle(allItems);
                return allItems.subList(0, Math.min(allItems.size(), 5));
            }
        } catch (Exception e) {
            log.error("❌ Lỗi lấy từ vựng từ Firestore: ", e);
        }
        return getBackupData(topic, level);
    }

    // ======================================================
    // 2. KIỂM TRA ĐẦU VÀO (LẤY TỪ FIRESTORE + CACHE)
    // ======================================================
    public List<QuestionDto> getPlacementQuestions() {
        if (cachedPlacementQuestions != null && !cachedPlacementQuestions.isEmpty()) {
            log.info("⚡ Lấy Placement Questions từ Cache");
            return cachedPlacementQuestions;
        }

        List<QuestionDto> questions = new ArrayList<>();
        try {
            QuerySnapshot querySnapshot = db.collection("placement_questions").get().get();
            for (QueryDocumentSnapshot doc : querySnapshot.getDocuments()) {
                questions.add(new QuestionDto(
                    doc.getId(), doc.getString("questionText"), (List<String>) doc.get("options")
                ));
            }
            cachedPlacementQuestions = questions;
            log.info("☁️ Đã tải và lưu Cache Placement Questions từ Firestore");
        } catch (Exception e) {
            log.error("❌ Lỗi Firestore (Placement): ", e);
        }
        return questions;
    }

    public PlacementTestResultDto gradePlacementTest(PlacementSubmissionDto submission) {
        int score = 0;
        int total = 0;
        try {
            QuerySnapshot querySnapshot = db.collection("placement_questions").get().get();
            total = querySnapshot.size();

            for (QueryDocumentSnapshot doc : querySnapshot.getDocuments()) {
                String correctAns = doc.getString("correctAnswer");
                String userAns = submission.getAnswers().get(doc.getId());
                if (correctAns != null && correctAns.equals(userAns)) score++;
            }
        } catch (Exception e) { log.error("Lỗi chấm điểm: ", e); }

        String level = (score >= (total * 0.8)) ? "B1" : (score >= (total * 0.4)) ? "A2" : "A1";
        return new PlacementTestResultDto(score, total, level);
    }

    // ======================================================
    // 3. NGỮ PHÁP & BÀI TẬP (LẤY TỪ FIRESTORE + CACHE)
    // ======================================================
    public List<GrammarLessonDto> getGrammarLessons(String level) {
        if (cachedGrammarLessons != null && !cachedGrammarLessons.isEmpty()) {
            log.info("⚡ Lấy Grammar Lessons từ Cache");
            return cachedGrammarLessons.stream()
                    .filter(l -> l.getLevel().equalsIgnoreCase(level))
                    .toList();
        }

        List<GrammarLessonDto> lessons = new ArrayList<>();
        try {
            QuerySnapshot querySnapshot = db.collection("grammar_lessons").get().get();
            for (QueryDocumentSnapshot doc : querySnapshot.getDocuments()) {
                lessons.add(new GrammarLessonDto(
                    doc.getId(), doc.getString("title"), doc.getString("description"),
                    doc.getString("example"), doc.getString("level")
                ));
            }
            cachedGrammarLessons = lessons;
            log.info("☁️ Đã tải và lưu Cache toàn bộ Grammar Lessons từ Firestore");

            return lessons.stream().filter(l -> l.getLevel().equalsIgnoreCase(level)).toList();
        } catch (Exception e) { log.error("Lỗi Firestore (Grammar): ", e); }
        return lessons;
    }

    public List<GrammarExerciseDto> getExercisesByLevel(String level) {
        List<GrammarExerciseDto> exercises = new ArrayList<>();
        try {
            Query query = db.collection("grammar_exercises").whereEqualTo("level", level);
            for (QueryDocumentSnapshot doc : query.get().get().getDocuments()) {
                exercises.add(new GrammarExerciseDto(
                    doc.getId(), doc.getString("question"), doc.getString("answer"), level
                ));
            }
        } catch (Exception e) { log.error("Lỗi: ", e); }
        return exercises;
    }

    private List<VocabularyItemDto> getBackupData(String topic, String level) {
        return Arrays.asList(
            new VocabularyItemDto("v1", "Map", "Bản đồ", "I need a map.", "/mæp/", topic, level, false)
        );
    }

    public void markAsLearned(String id) {
        System.out.println("✅ Đã đánh dấu học từ ID: " + id);
    }
}