package com.englishwebsite.EnglishWebsite.reading_writing_quiz_progress_nhom4.dto;

import java.util.List;

/**
 * DTO câu hỏi quiz – trắc nghiệm, điền từ, kéo thả.
 * Nhóm 4 – Interactive Quizzes (Chức năng 11).
 */
public class QuizQuestionDto {

    private String id;
    private String lessonId;
    private String type;  // MULTIPLE_CHOICE, FILL_BLANK, DRAG_DROP
    private String questionText;
    private List<String> options;
    private String correctAnswer;
    private List<String> correctAnswers;
    private int order;
    private String explanation;

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
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
