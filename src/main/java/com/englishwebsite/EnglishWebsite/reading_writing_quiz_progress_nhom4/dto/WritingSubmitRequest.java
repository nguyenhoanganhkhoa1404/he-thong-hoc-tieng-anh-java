package com.englishwebsite.EnglishWebsite.reading_writing_quiz_progress_nhom4.dto;

/**
 * Request gửi bài viết – Chức năng 10.
 */
public class WritingSubmitRequest {

    private String userId;
    private String lessonId;
    private String prompt;
    private String content;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getLessonId() { return lessonId; }
    public void setLessonId(String lessonId) { this.lessonId = lessonId; }
    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
