package com.englishwebsite.EnglishWebsite.listening_speaking_nhom3.dto;

/**
 * Bài học nghe – Nhóm 3.
 */
public class ListeningLessonDto {

    private String id;
    private String title;
    private String level;
    private String description;
    /** URL file âm thanh (frontend phát trực tiếp). */
    private String audioUrl;
    /** Bản ghi để hiển thị / học sau khi nghe. */
    private String transcript;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }
    public String getTranscript() { return transcript; }
    public void setTranscript(String transcript) { this.transcript = transcript; }
}
