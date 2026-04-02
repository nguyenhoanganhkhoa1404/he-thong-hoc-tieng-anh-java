package com.englishwebsite.EnglishWebsite.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
public class Submission {
    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "test_set_id")
    private TestSet testSet;

    @Column(name = "submission_type", length = 20)
    private String submissionType; // WRITING, SPEAKING

    @Column(columnDefinition = "TEXT")
    private String content; // Text for writing, audio URL for speaking

    private Double score;

    @Column(name = "ai_feedback", columnDefinition = "TEXT")
    private String aiFeedback;

    private LocalDateTime createdAt;

    public Submission() {
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public TestSet getTestSet() { return testSet; }
    public void setTestSet(TestSet testSet) { this.testSet = testSet; }
    public String getSubmissionType() { return submissionType; }
    public void setSubmissionType(String submissionType) { this.submissionType = submissionType; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    public String getAiFeedback() { return aiFeedback; }
    public void setAiFeedback(String aiFeedback) { this.aiFeedback = aiFeedback; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
