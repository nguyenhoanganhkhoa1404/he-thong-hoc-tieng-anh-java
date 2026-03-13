package com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto;

public class GrammarExerciseDto {
    private String id;
    private String question;
    private String correctAnswer;
    private String level;

    public GrammarExerciseDto(String id, String question, String correctAnswer, String level) {
        this.id = id;
        this.question = question;
        this.correctAnswer = correctAnswer;
        this.level = level;
    }

    // Getters
    public String getId() { return id; }
    public String getQuestion() { return question; }
    public String getCorrectAnswer() { return correctAnswer; }
    public String getLevel() { return level; }
}