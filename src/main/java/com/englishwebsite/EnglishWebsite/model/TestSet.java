package com.englishwebsite.EnglishWebsite.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "test_sets")
public class TestSet {
    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(length = 50)
    private String type; // READING, LISTENING, WRITING, SPEAKING, FULL_TEST

    private int duration; // in minutes

    @Column(length = 50)
    private String level; // A1, A2, B1, B2, C1, C2

    @Column(name = "teacher_id", length = 50)
    private String teacherId;

    @Column(columnDefinition = "TEXT")
    private String description;

    public TestSet() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
