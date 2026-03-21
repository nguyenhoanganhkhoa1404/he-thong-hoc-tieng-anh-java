package com.englishwebsite.EnglishWebsite.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "daily_plans")
public class DailyPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", length = 50)
    private String userId;

    private LocalDate date;

    @Column(columnDefinition = "TEXT")
    private String tasks; // Comma separated tasks or JSON

    private boolean completed;

    public DailyPlan() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getTasks() { return tasks; }
    public void setTasks(String tasks) { this.tasks = tasks; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}
