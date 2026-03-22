package com.englishwebsite.EnglishWebsite.listening_speaking_nhom3.dto;

import java.util.Map;

public class ListeningSubmitRequest {

    private String userId;
    private String lessonId;
    private Map<String, String> answers;
    private long timeSpentSeconds;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getLessonId() { return lessonId; }
    public void setLessonId(String lessonId) { this.lessonId = lessonId; }
    public Map<String, String> getAnswers() { return answers; }
    public void setAnswers(Map<String, String> answers) { this.answers = answers; }
    public long getTimeSpentSeconds() { return timeSpentSeconds; }
    public void setTimeSpentSeconds(long timeSpentSeconds) { this.timeSpentSeconds = timeSpentSeconds; }
}
