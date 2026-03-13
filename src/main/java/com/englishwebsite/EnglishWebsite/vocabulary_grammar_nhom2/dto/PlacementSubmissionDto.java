package com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto;

import java.util.Map;

public class PlacementSubmissionDto {
    private String userId; // ID của người làm bài
    private Map<String, String> answers; // Map chứa <QuestionId, SelectedAnswer>

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Map<String, String> getAnswers() { return answers; }
    public void setAnswers(Map<String, String> answers) { this.answers = answers; }
}