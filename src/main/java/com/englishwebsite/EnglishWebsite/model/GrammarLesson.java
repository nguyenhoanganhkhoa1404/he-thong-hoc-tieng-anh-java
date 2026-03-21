package com.englishwebsite.EnglishWebsite.model;

import jakarta.persistence.*;

@Entity
@Table(name = "grammar_lessons")
public class GrammarLesson {
    @Id
    @Column(length = 50)
    private String id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String topic;
    
    @Column(length = 10)
    private String level;

    public GrammarLesson() {}

    public GrammarLesson(String id, String title, String description, String topic, String level) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.topic = topic;
        this.level = level;
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
}
