package com.englishwebsite.EnglishWebsite.learning_plan_forum_nhom5.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO cho kế hoạch học hàng ngày.
 * Nhóm 5 – Daily Learning Plan (Chức năng 14).
 */
public class DailyPlanDto {
    private String id;
    private String userId;
    private String date;        // ISO yyyy-MM-dd
    private List<TaskDto> tasks = new ArrayList<>();

    public DailyPlanDto() { }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public List<TaskDto> getTasks() { return tasks; }
    public void setTasks(List<TaskDto> tasks) { this.tasks = tasks; }

    /**
     * Một nhiệm vụ trong kế hoạch.
     */
    public static class TaskDto {
        private String id;
        private String text;
        private boolean completed;

        public TaskDto() { }
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
        public boolean isCompleted() { return completed; }
        public void setCompleted(boolean completed) { this.completed = completed; }
    }
}
