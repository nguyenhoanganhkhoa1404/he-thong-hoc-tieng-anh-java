package com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto;

public class VocabularyItemDto {
    private String id;
    private String word;
    private String translation;
    private String example;
    private String topic;
    private String level;
    private boolean learned;

    public VocabularyItemDto() {}

    public VocabularyItemDto(String id, String word, String translation, String example, String topic, String level, boolean learned) {
        this.id = id;
        this.word = word;
        this.translation = translation;
        this.example = example;
        this.topic = topic;
        this.level = level;
        this.learned = learned;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getWord() { return word; }
    public void setWord(String word) { this.word = word; }
    public String getTranslation() { return translation; }
    public void setTranslation(String translation) { this.translation = translation; }
    public String getExample() { return example; }
    public void setExample(String example) { this.example = example; }
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public boolean isLearned() { return learned; }
    public void setLearned(boolean learned) { this.learned = learned; }
}
