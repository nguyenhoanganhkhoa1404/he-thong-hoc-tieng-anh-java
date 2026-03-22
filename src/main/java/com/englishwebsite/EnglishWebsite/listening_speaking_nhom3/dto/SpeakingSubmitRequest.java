package com.englishwebsite.EnglishWebsite.listening_speaking_nhom3.dto;

/**
 * Nội dung luyện nói: có thể là bản ghi lời nói (text) sau khi người học tự ghi hoặc STT phía client.
 */
public class SpeakingSubmitRequest {

    private String userId;
    private String promptId;
    /** Bản text người học nộp (mô phỏng nội dung đã nói). */
    private String transcript;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getPromptId() { return promptId; }
    public void setPromptId(String promptId) { this.promptId = promptId; }
    public String getTranscript() { return transcript; }
    public void setTranscript(String transcript) { this.transcript = transcript; }
}
