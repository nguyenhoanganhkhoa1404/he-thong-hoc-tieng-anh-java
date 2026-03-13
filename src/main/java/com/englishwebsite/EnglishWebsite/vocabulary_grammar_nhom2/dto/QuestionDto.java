package com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto;

import java.util.List;

public class QuestionDto {
    private String id;
    private String questionText;
    private List<String> options;

    public QuestionDto(String id, String questionText, List<String> options) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }
}