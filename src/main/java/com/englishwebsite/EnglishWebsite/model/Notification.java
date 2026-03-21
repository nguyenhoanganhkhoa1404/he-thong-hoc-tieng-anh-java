package com.englishwebsite.EnglishWebsite.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @Column(length = 50)
    private String id;
    
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(length = 20)
    private String targetType; // USER, COURSE, CLASS, ALL
    
    @Column(length = 50)
    private String targetId;
    
    private LocalDateTime createdAt;
    
    @Column(name = "is_read")
    private boolean read;

    public Notification() {
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }
    public String getTargetId() { return targetId; }
    public void setTargetId(String targetId) { this.targetId = targetId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
}
