package com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto;

public class GrammarLessonDto {
    private String id;
    private String title;
    private String description;
    private String example;
    private String level; // 🔥 Thêm trường này vào để hứng dữ liệu

    // Constructor rỗng (Bắt buộc phải có để Firebase/Spring Boot map dữ liệu)
    public GrammarLessonDto() {
    }

    // Constructor đầy đủ 5 tham số
    public GrammarLessonDto(String id, String title, String description, String example, String level) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.example = example;
        this.level = level;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getExample() {
        return example;
    }

    public void setExample(String example) {
        this.example = example;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}