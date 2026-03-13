package com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.service;

import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.*;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections; // Cần thiết để xào bài ngẫu nhiên
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class VocabularyGrammarService {

    private final Map<String, String> correctAnswers = new HashMap<>();

    public VocabularyGrammarService() {
        // --- 1. ĐÁP ÁN BÀI KIỂM TRA ĐẦU VÀO ---
        correctAnswers.put("q1", "am");
        correctAnswers.put("q2", "does");
        correctAnswers.put("q3", "went");
        correctAnswers.put("q4", "has been");
        correctAnswers.put("q5", "would have");
    }

    // ======================================================
    // CHỨC NĂNG 5: HỌC TỪ VỰNG (🔥 RANDOM 5 TỪ TỪ FIRESTORE 🔥)
    // ======================================================
    public List<VocabularyItemDto> getVocabulary(String topic, String level) {
        List<VocabularyItemDto> allItems = new ArrayList<>();
        
        try {
            Firestore db = FirestoreClient.getFirestore();
            CollectionReference vocabRef = db.collection("vocabulary");

            // 1. Lấy một "cụm" dữ liệu (ví dụ 50 từ) để làm kho trộn ngẫu nhiên
            Query query = vocabRef.whereEqualTo("level", level).limit(50);
            ApiFuture<QuerySnapshot> querySnapshot = query.get();

            for (QueryDocumentSnapshot doc : querySnapshot.get().getDocuments()) {
                allItems.add(new VocabularyItemDto(
                    doc.getId(),
                    doc.getString("word"),
                    doc.getString("meaning"),
                    doc.getString("example"),
                    doc.getString("pronunciation"),
                    topic, 
                    level, 
                    false
                ));
            }

            // 2. Xử lý ngẫu nhiên nếu có dữ liệu
            if (!allItems.isEmpty()) {
                // Xào bài ngẫu nhiên
                Collections.shuffle(allItems);
                
                // Rút ra 5 từ đầu tiên (hoặc ít hơn nếu kho không đủ 5 từ)
                int numberOfItems = Math.min(allItems.size(), 5);
                List<VocabularyItemDto> randomFive = allItems.subList(0, numberOfItems);
                
                System.out.println("🎲 [RANDOM] Đã bốc 5 từ ngẫu nhiên cho Ritchi từ Level: " + level);
                return randomFive;
            } else {
                System.out.println("⚠️ Không tìm thấy từ, dùng data dự phòng.");
                return getBackupData(topic, level);
            }

        } catch (InterruptedException | ExecutionException e) {
            System.err.println("❌ Lỗi: " + e.getMessage());
            return getBackupData(topic, level);
        }
    }

    private List<VocabularyItemDto> getBackupData(String topic, String level) {
        return Arrays.asList(
            new VocabularyItemDto("v1", "Map", "Bản đồ", "I need a map.", "/mæp/", topic, level, false),
            new VocabularyItemDto("v2", "Ticket", "Vé", "Show your ticket.", "/ˈtɪk.ɪt/", topic, level, false)
        );
    }

    // ======================================================
    // CHỨC NĂNG 4: PLACEMENT TEST (GIỮ NGUYÊN)
    // ======================================================
    public List<QuestionDto> getPlacementQuestions() {
        return Arrays.asList(
            new QuestionDto("q1", "I ___ a student.", Arrays.asList("am", "is", "are")),
            new QuestionDto("q2", "What ___ she do every morning?", Arrays.asList("do", "does", "did")),
            new QuestionDto("q3", "Yesterday, they ___ to the cinema.", Arrays.asList("go", "goes", "went")),
            new QuestionDto("q4", "She ___ studying English for 5 years.", Arrays.asList("is", "has been", "was")),
            new QuestionDto("q5", "If I had known, I ___ told you.", Arrays.asList("will", "would have", "should"))
        );
    }

    public PlacementTestResultDto gradePlacementTest(PlacementSubmissionDto submission) {
        int score = 0;
        if (submission.getAnswers() != null) {
            for (Map.Entry<String, String> entry : submission.getAnswers().entrySet()) {
                String correct = correctAnswers.get(entry.getKey());
                if (correct != null && correct.equals(entry.getValue())) score++;
            }
        }
        String level = (score >= 4) ? "B1 (Intermediate)" : (score >= 2) ? "A2 (Pre-Elementary)" : "A1 (Beginner)";
        return new PlacementTestResultDto(score, 5, level);
    }

    // ======================================================
    // CHỨC NĂNG 6: NGỮ PHÁP & BÀI TẬP (GIỮ NGUYÊN)
    // ======================================================
    public List<GrammarLessonDto> getGrammarLessons(String level) {
        List<GrammarLessonDto> list = new ArrayList<>();
        if ("A1".equalsIgnoreCase(level)) {
            list.add(new GrammarLessonDto("g1", "Present Simple", "Diễn tả thói quen.", "I study every day."));
        } else if ("A2".equalsIgnoreCase(level)) {
            list.add(new GrammarLessonDto("g2", "Past Simple", "Hành động đã kết thúc.", "I finished work yesterday."));
        }
        return list;
    }

    public List<GrammarExerciseDto> getExercisesByLevel(String level) {
        return Arrays.asList(
            new GrammarExerciseDto("e1", "I (be) ___ a student.", "am", level),
            new GrammarExerciseDto("e2", "She (work) ___ here.", "works", level)
        );
    }

    public void markAsLearned(String id) {
        System.out.println("Đã đánh dấu học từ ID: " + id);
    }
}