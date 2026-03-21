package com.englishwebsite.EnglishWebsite.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"userId", "itemId", "type"})
})
public class UserProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String userId;
    
    @Column(nullable = false)
    private String itemId;
    
    @Column(nullable = false, length = 20)
    private String type; // VOCAB, GRAMMAR
    
    private boolean completed;
    
    private LocalDateTime updatedAt;

    public UserProgress() {
        this.updatedAt = LocalDateTime.now();
    }

    public UserProgress(String userId, String itemId, String type, boolean completed) {
        this();
        this.userId = userId;
        this.itemId = itemId;
        this.type = type;
        this.completed = completed;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getItemId() { return itemId; }
    public void setItemId(String itemId) { this.itemId = itemId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
