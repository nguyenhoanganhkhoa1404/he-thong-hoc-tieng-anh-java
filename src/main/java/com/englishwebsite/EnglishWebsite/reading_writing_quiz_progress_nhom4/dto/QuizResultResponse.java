package com.englishwebsite.EnglishWebsite.reading_writing_quiz_progress_nhom4.dto;

/**
 * Response sau khi nộp quiz.
 */
public class QuizResultResponse {

    private String userId;
    private String lessonId;
    private int score;
    private int totalQuestions;
    private boolean passed;
    private long timeSpentSeconds;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getLessonId() { return lessonId; }
    public void setLessonId(String lessonId) { this.lessonId = lessonId; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }
    public boolean isPassed() { return passed; }
    public void setPassed(boolean passed) { this.passed = passed; }
    public long getTimeSpentSeconds() { return timeSpentSeconds; }
    public void setTimeSpentSeconds(long timeSpentSeconds) { this.timeSpentSeconds = timeSpentSeconds; }
}
