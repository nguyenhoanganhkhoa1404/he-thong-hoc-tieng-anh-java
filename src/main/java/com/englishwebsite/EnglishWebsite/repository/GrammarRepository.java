package com.englishwebsite.EnglishWebsite.repository;

import com.englishwebsite.EnglishWebsite.model.GrammarLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrammarRepository extends JpaRepository<GrammarLesson, String> {
    List<GrammarLesson> findByTopicAndLevel(String topic, String level);
    List<GrammarLesson> findByTopic(String topic);
    List<GrammarLesson> findByLevel(String level);
}
