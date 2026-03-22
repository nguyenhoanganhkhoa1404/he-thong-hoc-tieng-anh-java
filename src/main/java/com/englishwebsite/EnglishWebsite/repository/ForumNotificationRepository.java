package com.englishwebsite.EnglishWebsite.repository;

import com.englishwebsite.EnglishWebsite.model.ForumNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumNotificationRepository extends JpaRepository<ForumNotification, String> {
    List<ForumNotification> findByUserIdOrderByCreatedAtDesc(String userId);
}
