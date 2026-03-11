package com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto;

import java.util.List;

/**
 * DTO mô tả khoá học và các bài học bên trong.
 * Nhóm 6 – Course Management (Chức năng 17).
 */
public class CourseDto {

    private String id;
    private String title;
    private String description;
    private String level;              // A1, A2, B1, ...
    private boolean published;        // Đã publish cho learner hay chưa

    // Đơn giản hoá: danh sách id bài học / module
    private List<String> moduleIds;

    public CourseDto() {
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }

    public List<String> getModuleIds() {
        return moduleIds;
    }

    public void setModuleIds(List<String> moduleIds) {
        this.moduleIds = moduleIds;
    }
}

