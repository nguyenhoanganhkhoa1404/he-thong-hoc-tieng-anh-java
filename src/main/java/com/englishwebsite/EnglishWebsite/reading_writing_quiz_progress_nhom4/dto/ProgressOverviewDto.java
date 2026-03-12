package com.englishwebsite.EnglishWebsite.reading_writing_quiz_progress_nhom4.dto;

import java.util.HashMap;
import java.util.Map;

/**
 * Tổng quan tiến độ – Chức năng 12.
 */
public class ProgressOverviewDto {

    private String userId;
    private int totalLessonsCompleted;
    private double averageScore;
    private String currentLevel;
    private Map<String, SkillProgressDto> bySkill = new HashMap<>();

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public int getTotalLessonsCompleted() { return totalLessonsCompleted; }
    public void setTotalLessonsCompleted(int totalLessonsCompleted) { this.totalLessonsCompleted = totalLessonsCompleted; }
    public double getAverageScore() { return averageScore; }
    public void setAverageScore(double averageScore) { this.averageScore = averageScore; }
    public String getCurrentLevel() { return currentLevel; }
    public void setCurrentLevel(String currentLevel) { this.currentLevel = currentLevel; }
    public Map<String, SkillProgressDto> getBySkill() { return bySkill; }
    public void setBySkill(Map<String, SkillProgressDto> bySkill) { this.bySkill = bySkill != null ? bySkill : new HashMap<>(); }
}
