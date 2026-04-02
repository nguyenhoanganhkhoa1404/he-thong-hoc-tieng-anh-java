package com.englishwebsite.EnglishWebsite.reading_writing_quiz_progress_nhom4.dto;

import java.util.Map;

/**
 * Request nộp kết quả quiz – Chức năng 11.
 */
public class QuizResultRequest {

    private String userId;
    private String lessonId;
    private Integer score;
    private Map<String, String> answers;
    private long timeSpentSeconds;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getLessonId() { return lessonId; }
    public void setLessonId(String lessonId) { this.lessonId = lessonId; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public Map<String, String> getAnswers() { return answers; }
    public void setAnswers(Map<String, String> answers) { this.answers = answers; }
    public long getTimeSpentSeconds() { return timeSpentSeconds; }
    public void setTimeSpentSeconds(long timeSpentSeconds) { this.timeSpentSeconds = timeSpentSeconds; }
}
