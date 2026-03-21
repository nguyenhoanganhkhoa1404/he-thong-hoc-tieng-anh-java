package com.englishwebsite.EnglishWebsite.repository;

import com.englishwebsite.EnglishWebsite.model.VocabularyItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VocabularyRepository extends JpaRepository<VocabularyItem, String> {
    List<VocabularyItem> findByTopicAndLevel(String topic, String level);
    List<VocabularyItem> findByTopic(String topic);
    List<VocabularyItem> findByLevel(String level);
}
