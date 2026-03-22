package com.englishwebsite.EnglishWebsite.listening_speaking_nhom3.dto;

/**
 * Chủ đề / câu gợi ý luyện nói.
 */
public class SpeakingPromptDto {

    private String id;
    private String lessonId;
    private String title;
    private String promptText;
    /** Gợi ý cấu trúc câu trả lời mẫu (so sánh đơn giản với bài nộp). */
    private String sampleAnswerHint;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getLessonId() { return lessonId; }
    public void setLessonId(String lessonId) { this.lessonId = lessonId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getPromptText() { return promptText; }
    public void setPromptText(String promptText) { this.promptText = promptText; }
    public String getSampleAnswerHint() { return sampleAnswerHint; }
    public void setSampleAnswerHint(String sampleAnswerHint) { this.sampleAnswerHint = sampleAnswerHint; }
}
