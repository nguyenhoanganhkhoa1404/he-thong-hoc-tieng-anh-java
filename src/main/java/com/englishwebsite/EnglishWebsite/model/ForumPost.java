package com.englishwebsite.EnglishWebsite.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "forum_posts")
public class ForumPost {
    @Id
    @Column(length = 50)
    private String id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "author_id", length = 50)
    private String authorId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private String topic;

    @Column(columnDefinition = "integer default 0")
    private int likes = 0;

    public ForumPost() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
    public int getLikes() { return likes; }
    public void setLikes(int likes) { this.likes = likes; }
}
