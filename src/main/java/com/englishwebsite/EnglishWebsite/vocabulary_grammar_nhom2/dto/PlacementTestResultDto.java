package com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto;

public class PlacementTestResultDto {
    private int score;
    private int totalQuestions;
    private String assignedLevel;

    public PlacementTestResultDto(int score, int totalQuestions, String assignedLevel) {
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.assignedLevel = assignedLevel;
    }

    // Getters and Setters
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }
    public String getAssignedLevel() { return assignedLevel; }
    public void setAssignedLevel(String assignedLevel) { this.assignedLevel = assignedLevel; }
}