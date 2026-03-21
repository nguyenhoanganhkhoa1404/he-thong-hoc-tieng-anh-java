package com.englishwebsite.EnglishWebsite.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "achievements")
public class Achievement {
    @Id
    @Column(length = 50)
    private String id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private boolean unlocked;

    @Column(name = "date_unlocked")
    private LocalDateTime dateUnlocked;

    @Column(name = "user_id", length = 50)
    private String userId;

    public Achievement() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public boolean isUnlocked() { return unlocked; }
    public void setUnlocked(boolean unlocked) { this.unlocked = unlocked; }
    public LocalDateTime getDateUnlocked() { return dateUnlocked; }
    public void setDateUnlocked(LocalDateTime dateUnlocked) { this.dateUnlocked = dateUnlocked; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
