package com.englishwebsite.EnglishWebsite.model;

import jakarta.persistence.*;

@Entity
@Table(name = "teacher_details")
public class TeacherDetail {
    @Id
    @Column(name = "user_id", length = 50)
    private String userId;

    private String qualification;

    private String experience;

    @Column(columnDefinition = "TEXT")
    private String biography;

    public TeacherDetail() {}

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }
    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
    public String getBiography() { return biography; }
    public void setBiography(String biography) { this.biography = biography; }
}
