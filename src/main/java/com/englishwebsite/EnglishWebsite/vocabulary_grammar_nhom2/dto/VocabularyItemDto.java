package com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto;

public class VocabularyItemDto {
    private String id;
    private String word;
    private String meaning;
    private String example;
    private String pronunciation;
    private String category; // Đổi topic thành category cho khớp với Service
    private String level;
    private boolean learned;

    public VocabularyItemDto(String id, String word, String meaning, String example, String pronunciation, String category, String level, boolean learned) {
        this.id = id;
        this.word = word;
        this.meaning = meaning;
        this.example = example;
        this.pronunciation = pronunciation;
        this.category = category;
        this.level = level;
        this.learned = learned;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getWord() { return word; }
    public void setWord(String word) { this.word = word; }

    public String getMeaning() { return meaning; }
    public void setMeaning(String meaning) { this.meaning = meaning; }

    public String getExample() { return example; }
    public void setExample(String example) { this.example = example; }

    public String getPronunciation() { return pronunciation; }
    public void setPronunciation(String pronunciation) { this.pronunciation = pronunciation; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public boolean isLearned() { return learned; }
    public void setLearned(boolean learned) { this.learned = learned; }
}