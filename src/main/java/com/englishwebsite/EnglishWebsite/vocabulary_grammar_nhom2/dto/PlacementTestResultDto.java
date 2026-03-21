package com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto;

public class PlacementTestResultDto {
    private String userId;
    private Integer score;
    private String level;
    private String message;

    public PlacementTestResultDto() {}

    public PlacementTestResultDto(String userId, Integer score, String level, String message) {
        this.userId = userId;
        this.score = score;
        this.level = level;
        this.message = message;
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
