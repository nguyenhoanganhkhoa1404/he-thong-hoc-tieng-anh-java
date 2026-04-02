package com.englishwebsite.EnglishWebsite.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Model đại diện cho người dùng trong hệ thống
 * Hỗ trợ 2 vai trò: LEARNER (học viên) và TEACHER (giáo viên)
 */
@Entity
@Table(name = "users")
public class User {
    @Id
    @Column(length = 128)
    private String uid;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    private String displayName;

    @Column(length = 20)
    private String role; // LEARNER hoặc TEACHER

    private String phoneNumber;

    @Column(length = 512)
    private String photoUrl;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private boolean emailVerified;
    
    // Thông tin bổ sung cho học viên
    @Column(length = 10)
    private String level = "A1"; // A1, A2, B1, B2, C1, C2

    private Integer placementTestScore;
    
    // Thông tin bổ sung cho giáo viên
    private String teacherId;
    private String specialization;
    private boolean active;
    
    private Integer streak = 0;
    private Integer xp = 0;

    // Constructors
    public User() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public User(String uid, String email, String role) {
        this();
        this.uid = uid;
        this.email = email;
        this.role = role;
    }

    // Getters and Setters
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Integer getPlacementTestScore() {
        return placementTestScore;
    }

    public void setPlacementTestScore(Integer placementTestScore) {
        this.placementTestScore = placementTestScore;
    }

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Integer getStreak() {
        return streak;
    }

    public void setStreak(Integer streak) {
        this.streak = streak;
    }

    public Integer getXp() {
        return xp;
    }

    public void setXp(Integer xp) {
        this.xp = xp;
    }

    // Helper methods
    // Leveling Logic
    private static final List<String> LEVELS = List.of("A1", "A2", "B1", "B2", "C1", "C2");

    public void promoteLevel() {
        int currentIndex = LEVELS.indexOf(this.level != null ? this.level : "A1");
        if (currentIndex < LEVELS.size() - 1) {
            this.level = LEVELS.get(currentIndex + 1);
        }
    }

    public void demoteLevel() {
        int currentIndex = LEVELS.indexOf(this.level != null ? this.level : "A1");
        if (currentIndex > 0) {
            this.level = LEVELS.get(currentIndex - 1);
        }
    }

    public boolean isLearner() {
        return "LEARNER".equalsIgnoreCase(role);
    }

    public boolean isTeacher() {
        return "TEACHER".equalsIgnoreCase(role);
    }
}
