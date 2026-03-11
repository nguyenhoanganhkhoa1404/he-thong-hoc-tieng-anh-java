package com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto;

/**
 * DTO mô tả tài khoản giáo viên / admin.
 * Nhóm 6 – Teacher / Admin Management (Chức năng 16).
 */
public class TeacherAccountDto {

    private String uid;          // Firebase UID
    private String email;
    private String displayName;
    private String role;         // TEACHER hoặc ADMIN
    private String teacherId;    // Mã giáo viên nội bộ
    private String specialization;
    private boolean active;

    public TeacherAccountDto() {
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
}

