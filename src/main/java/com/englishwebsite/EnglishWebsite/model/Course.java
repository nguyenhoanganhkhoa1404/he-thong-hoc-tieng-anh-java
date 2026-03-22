package com.englishwebsite.EnglishWebsite.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.Arrays;
import java.util.stream.Collectors;

@Entity
@Table(name = "courses")
public class Course {
    @Id
    @Column(length = 50)
    private String id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(length = 10)
    private String level;
    
    private boolean published;
    
    @Column(length = 50)
    private String teacherId;
    
    private Double price;
    
    private Double rating;
    
    private Integer totalStudents;
    
    @Column(columnDefinition = "TEXT")
    private String moduleIdsString; // Stored as comma-separated IDs

    public Course() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }

    public List<String> getModuleIds() {
        if (moduleIdsString == null || moduleIdsString.isEmpty()) return List.of();
        return Arrays.asList(moduleIdsString.split(","));
    }

    public void setModuleIds(List<String> moduleIds) {
        if (moduleIds == null || moduleIds.isEmpty()) {
            this.moduleIdsString = null;
        } else {
            this.moduleIdsString = String.join(",", moduleIds);
        }
    }

    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public Integer getTotalStudents() { return totalStudents; }
    public void setTotalStudents(Integer totalStudents) { this.totalStudents = totalStudents; }
}
