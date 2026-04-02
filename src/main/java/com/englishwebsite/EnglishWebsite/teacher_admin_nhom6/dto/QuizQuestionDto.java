package com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto;

import java.util.List;

public class QuizQuestionDto {
    private String id;
    private String lessonId;
    private String testSetId;
    private String type;
    private String questionText;
    private List<String> options;
    private String correctAnswer;
    private List<String> correctAnswers;
    private String explanation;
    private int order;
    private String difficultyLevel;

    public QuizQuestionDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getLessonId() { return lessonId; }
    public void setLessonId(String lessonId) { this.lessonId = lessonId; }
    public String getTestSetId() { return testSetId; }
    public void setTestSetId(String testSetId) { this.testSetId = testSetId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }
    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
    public List<String> getCorrectAnswers() { return correctAnswers; }
    public void setCorrectAnswers(List<String> correctAnswers) { this.correctAnswers = correctAnswers; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }
    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }
}
