package com.englishwebsite.EnglishWebsite.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vocabulary_items")
public class VocabularyItem {
    @Id
    @Column(length = 50)
    private String id;
    
    @Column(nullable = false)
    private String word;
    
    private String translation;
    
    @Column(columnDefinition = "TEXT")
    private String example;
    
    private String topic;
    
    @Column(length = 10)
    private String level;

    public VocabularyItem() {}

    public VocabularyItem(String id, String word, String translation, String example, String topic, String level) {
        this.id = id;
        this.word = word;
        this.translation = translation;
        this.example = example;
        this.topic = topic;
        this.level = level;
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
}
