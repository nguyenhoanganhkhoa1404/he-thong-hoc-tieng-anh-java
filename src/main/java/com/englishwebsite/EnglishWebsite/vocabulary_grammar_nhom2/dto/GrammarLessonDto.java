package com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto;

public class GrammarLessonDto {
    private String id;
    private String title;
    private String usage;
    private String example;

    public GrammarLessonDto(String id, String title, String usage, String example) {
        this.id = id; this.title = title; this.usage = usage; this.example = example;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getUsage() { return usage; }
    public String getExample() { return example; }
}