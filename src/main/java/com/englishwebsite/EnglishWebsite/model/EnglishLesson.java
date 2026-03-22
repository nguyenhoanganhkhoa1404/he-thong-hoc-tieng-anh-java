package com.englishwebsite.EnglishWebsite.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "english_lessons")
public class EnglishLesson {

    @Id
    @Column(length = 50)
    private String id;

    @Column(length = 20)
    private String skill;

    @Column(length = 255)
    private String title;

    @Column(length = 50)
    private String level;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "media_url", length = 255)
    private String mediaUrl;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    public EnglishLesson() {
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
}
