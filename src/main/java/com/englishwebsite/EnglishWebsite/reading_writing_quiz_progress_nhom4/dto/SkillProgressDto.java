package com.englishwebsite.EnglishWebsite.reading_writing_quiz_progress_nhom4.dto;

/**
 * Tiến độ theo kỹ năng – Chức năng 12.
 */
public class SkillProgressDto {

    private int completedLessons;
    private double averageScore;
    private String level;

    public int getCompletedLessons() { return completedLessons; }
    public void setCompletedLessons(int completedLessons) { this.completedLessons = completedLessons; }
    public double getAverageScore() { return averageScore; }
    public void setAverageScore(double averageScore) { this.averageScore = averageScore; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
}
