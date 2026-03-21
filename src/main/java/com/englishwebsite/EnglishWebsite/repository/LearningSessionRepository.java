package com.englishwebsite.EnglishWebsite.repository;

import com.englishwebsite.EnglishWebsite.model.LearningSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningSessionRepository extends JpaRepository<LearningSession, Long> {
    List<LearningSession> findByUserId(String userId);
}
