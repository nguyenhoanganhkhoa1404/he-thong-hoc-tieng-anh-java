package com.englishwebsite.EnglishWebsite.model;

import java.time.LocalDateTime;

/**
 * Model đại diện cho người dùng trong hệ thống
 * Hỗ trợ 2 vai trò: LEARNER (học viên) và TEACHER (giáo viên)
 */
public class User {
    private String uid; // Firebase UID
    private String email;
    private String displayName;
    private String role; // LEARNER hoặc TEACHER
    private String phoneNumber;
    private String photoUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean emailVerified;
    
    // Thông tin bổ sung cho học viên
    private String level; // A1, A2, B1, B2, C1, C2
    private Integer placementTestScore;
    
    // Thông tin bổ sung cho giáo viên
    private String teacherId;
    private String specialization;

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

    // Helper methods
    public boolean isLearner() {
        return "LEARNER".equalsIgnoreCase(role);
    }

    public boolean isTeacher() {
        return "TEACHER".equalsIgnoreCase(role);
    }
}
