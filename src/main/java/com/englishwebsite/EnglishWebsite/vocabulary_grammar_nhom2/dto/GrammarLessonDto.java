package com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto;

public class GrammarLessonDto {
    private String id;
    private String title;
    private String description;
    private String topic;
    private String level;
    private boolean completed;

    public GrammarLessonDto() {}

    public GrammarLessonDto(String id, String title, String description, String topic, String level, boolean completed) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.topic = topic;
        this.level = level;
        this.completed = completed;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}
