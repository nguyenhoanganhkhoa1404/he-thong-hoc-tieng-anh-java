package com.englishwebsite.EnglishWebsite.listening_speaking_nhom3.dto;

import java.util.List;

/**
 * Câu hỏi sau khi nghe – trắc nghiệm / điền từ.
 */
public class ListeningQuestionDto {

    private String id;
    private String lessonId;
    private String type;
    private String questionText;
    private List<String> options;
    private String correctAnswer;
    private List<String> correctAnswers;
    private int order;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getLessonId() { return lessonId; }
    public void setLessonId(String lessonId) { this.lessonId = lessonId; }
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
    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }
}
