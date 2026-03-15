package com.englishwebsite.EnglishWebsite.learning_plan_forum_nhom5.dto;

import java.time.LocalDateTime;

/**
 * DTO cho huy hiệu/thành tựu của người dùng.
 * Nhóm 5 – Achievements, Learning Plan & Forum (Chức năng 13).
 */
public class AchievementDto {
    private String id;
    private String name;
    private String description;
    private boolean unlocked;
    private LocalDateTime dateUnlocked;

    public AchievementDto() { }

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
}
