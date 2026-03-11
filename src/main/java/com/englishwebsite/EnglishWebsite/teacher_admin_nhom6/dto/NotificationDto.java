package com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto;

import java.time.LocalDateTime;

/**
 * DTO mô tả thông báo gửi cho người dùng / lớp / khoá học.
 * Nhóm 6 – Notification System (Chức năng 18).
 */
public class NotificationDto {

    private String id;
    private String title;
    private String content;
    private String targetType;     // USER, COURSE, CLASS, ALL
    private String targetId;       // id user / khoá học / lớp, nếu có
    private LocalDateTime createdAt;
    private boolean read;

    public NotificationDto() {
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTargetType() {
        return targetType;
    }

    public void setTargetType(String targetType) {
        this.targetType = targetType;
    }

    public String getTargetId() {
        return targetId;
    }

    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }
}

