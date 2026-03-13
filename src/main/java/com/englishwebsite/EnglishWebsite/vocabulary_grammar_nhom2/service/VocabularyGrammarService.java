package com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.service;

import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.PlacementSubmissionDto;
import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.PlacementTestResultDto;
import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.QuestionDto;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class VocabularyGrammarService {

    // Mock data: Danh sách câu hỏi và đáp án đúng (tạm thời để code cứng)
    private final Map<String, String> correctAnswers = new HashMap<>();
    
    public VocabularyGrammarService() {
        correctAnswers.put("q1", "am");
        correctAnswers.put("q2", "does");
        correctAnswers.put("q3", "went");
    }

    public List<QuestionDto> getPlacementQuestions() {
        return Arrays.asList(
            new QuestionDto("q1", "I ___ a student.", Arrays.asList("am", "is", "are")),
            new QuestionDto("q2", "What ___ she do?", Arrays.asList("do", "does", "did")),
            new QuestionDto("q3", "Yesterday, I ___ to the park.", Arrays.asList("go", "goes", "went"))
        );
    }

    public PlacementTestResultDto gradePlacementTest(PlacementSubmissionDto submission) {
        int score = 0;
        int total = correctAnswers.size();

        if (submission.getAnswers() != null) {
            for (Map.Entry<String, String> entry : submission.getAnswers().entrySet()) {
                String qId = entry.getKey();
                String userAnswer = entry.getValue();
                if (correctAnswers.containsKey(qId) && correctAnswers.get(qId).equals(userAnswer)) {
                    score++;
                }
            }
        }

        // Logic xếp loại level cơ bản
        String level = "A1";
        if (score == 3) level = "B1";
        else if (score == 2) level = "A2";

        // TODO: Lưu kết quả này xuống Firebase cho user (nếu có userId)

        return new PlacementTestResultDto(score, total, level);
    }
}