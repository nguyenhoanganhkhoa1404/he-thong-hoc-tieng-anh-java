package com.englishwebsite.EnglishWebsite.model;

import jakarta.persistence.*;

@Entity
@Table(name = "placement_questions")
public class PlacementQuestion {
    @Id
    @Column(length = 50)
    private String id;

    @Column(columnDefinition = "TEXT")
    private String question;

    @Column(name = "options_json", columnDefinition = "TEXT")
    private String optionsJson;

    @Column(name = "correct_answer")
    private String correctAnswer;

    private String level; // Target level for this question

    public PlacementQuestion() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getOptionsJson() { return optionsJson; }
    public void setOptionsJson(String optionsJson) { this.optionsJson = optionsJson; }
    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
}
