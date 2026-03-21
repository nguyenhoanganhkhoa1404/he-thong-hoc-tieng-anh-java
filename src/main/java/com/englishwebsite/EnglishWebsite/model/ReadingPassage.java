package com.englishwebsite.EnglishWebsite.model;

import jakarta.persistence.*;

@Entity
@Table(name = "reading_passages")
public class ReadingPassage {
    @Id
    @Column(length = 50)
    private String id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String level;

    private String topic;

    public ReadingPassage() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
}
