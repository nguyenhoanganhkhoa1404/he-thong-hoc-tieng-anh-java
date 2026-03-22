package com.englishwebsite.EnglishWebsite.reading_writing_quiz_progress_nhom4.dto;

import java.util.Map;

public class ReadingSubmitRequest {

    private String userId;
    private String passageId;
    private Map<String, String> answers;
    private long timeSpentSeconds;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getPassageId() { return passageId; }
    public void setPassageId(String passageId) { this.passageId = passageId; }
    public Map<String, String> getAnswers() { return answers; }
    public void setAnswers(Map<String, String> answers) { this.answers = answers; }
    public long getTimeSpentSeconds() { return timeSpentSeconds; }
    public void setTimeSpentSeconds(long timeSpentSeconds) { this.timeSpentSeconds = timeSpentSeconds; }
}
