package com.englishwebsite.EnglishWebsite.repository;

import com.englishwebsite.EnglishWebsite.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByTargetTypeAndTargetId(String targetType, String targetId);
    List<Notification> findByTargetType(String targetType);
    
    @Query("SELECT n FROM Notification n WHERE n.targetType = 'ALL' OR (n.targetType = 'USER' AND n.targetId = :userId)")
    List<Notification> findForUser(String userId);
}
