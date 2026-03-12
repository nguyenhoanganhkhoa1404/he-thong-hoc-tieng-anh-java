package com.englishwebsite.EnglishWebsite.reading_writing_quiz_progress_nhom4.dto;

import java.time.LocalDateTime;

/**
 * DTO bài tập viết – lưu bài viết và feedback.
 * Nhóm 4 – Writing Practice (Chức năng 10).
 */
public class WritingExerciseDto {

    private String id;
    private String userId;
    private String lessonId;
    private String prompt;
    private String content;
    private String feedback;
    private Integer score;
    private LocalDateTime createdAt;

    public WritingExerciseDto() {
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getLessonId() { return lessonId; }
    public void setLessonId(String lessonId) { this.lessonId = lessonId; }
    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
