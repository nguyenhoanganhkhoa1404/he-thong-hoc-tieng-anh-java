package com.englishwebsite.EnglishWebsite.reading_writing_quiz_progress_nhom4.dto;

import java.util.List;

public class ReadingQuestionDto {

    private String id;
    private String passageId;
    private String type;
    private String questionText;
    private List<String> options;
    private String correctAnswer;
    private int order;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPassageId() { return passageId; }
    public void setPassageId(String passageId) { this.passageId = passageId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }
    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }
}
