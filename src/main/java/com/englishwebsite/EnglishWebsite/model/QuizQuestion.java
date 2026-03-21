package com.englishwebsite.EnglishWebsite.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "quiz_questions")
public class QuizQuestion {
    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "lesson_id", length = 50)
    private String lessonId;

    @Column(length = 20)
    private String type; // MULTIPLE_CHOICE, FILL_BLANK, DRAG_DROP

    @Column(name = "question_text", columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "options_json", columnDefinition = "TEXT")
    private String optionsJson; // Stores List<String> as JSON or comma-separated

    @Column(name = "correct_answer")
    private String correctAnswer;

    @Column(name = "correct_answers_json", columnDefinition = "TEXT")
    private String correctAnswersJson;

    @Column(name = "display_order")
    private int order;

    public QuizQuestion() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getLessonId() { return lessonId; }
    public void setLessonId(String lessonId) { this.lessonId = lessonId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public String getOptionsJson() { return optionsJson; }
    public void setOptionsJson(String optionsJson) { this.optionsJson = optionsJson; }
    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
    public String getCorrectAnswersJson() { return correctAnswersJson; }
    public void setCorrectAnswersJson(String correctAnswersJson) { this.correctAnswersJson = correctAnswersJson; }
    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }
}
