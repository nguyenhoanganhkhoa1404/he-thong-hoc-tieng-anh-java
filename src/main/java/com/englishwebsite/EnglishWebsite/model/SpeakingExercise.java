package com.englishwebsite.EnglishWebsite.model;

import jakarta.persistence.*;

@Entity
@Table(name = "speaking_exercises")
public class SpeakingExercise {
    @Id
    @Column(length = 50)
    private String id;

    private String topic;

    @Column(columnDefinition = "TEXT")
    private String prompt;

    @Column(name = "sample_audio_url")
    private String sampleAudioUrl;

    private String level;

    public SpeakingExercise() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
    public String getSampleAudioUrl() { return sampleAudioUrl; }
    public void setSampleAudioUrl(String sampleAudioUrl) { this.sampleAudioUrl = sampleAudioUrl; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
}
