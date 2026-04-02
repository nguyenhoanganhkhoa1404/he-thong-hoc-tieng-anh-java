package com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto;

import java.util.List;

public class TestSetDto {
    private String id;
    private String name;
    private String type; // READING, LISTENING, WRITING, SPEAKING, FULL_TEST
    private int duration;
    private String level;
    private String description;
    private String teacherId;
    private List<QuizQuestionDto> questions;

    public TestSetDto() {}

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
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }
    public List<QuizQuestionDto> getQuestions() { return questions; }
    public void setQuestions(List<QuizQuestionDto> questions) { this.questions = questions; }
}
