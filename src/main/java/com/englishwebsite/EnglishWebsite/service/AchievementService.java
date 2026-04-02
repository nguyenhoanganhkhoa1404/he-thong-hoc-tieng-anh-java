package com.englishwebsite.EnglishWebsite.service;

import com.englishwebsite.EnglishWebsite.model.Achievement;
import com.englishwebsite.EnglishWebsite.repository.AchievementRepository;
import com.englishwebsite.EnglishWebsite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AchievementService {

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Achievement> getUserAchievements(String userId) {
        return achievementRepository.findByUserId(userId);
    }

    public Achievement awardAchievement(String userId, String name, String description) {
        if (userRepository.findById(userId).isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        // Prevent duplicate achievement names for the same user
        List<Achievement> existing = achievementRepository.findByUserId(userId);
        for (Achievement a : existing) {
            if (a.getName().equalsIgnoreCase(name)) {
                return a; // Already unlocked
            }
        }

        Achievement achievement = new Achievement();
        achievement.setId(UUID.randomUUID().toString());
        achievement.setUserId(userId);
        achievement.setName(name);
        achievement.setDescription(description);
        achievement.setUnlocked(true);
        achievement.setDateUnlocked(LocalDateTime.now());

        return achievementRepository.save(achievement);
    }

    public void checkAndAwardTeacherAchievements(String teacherId, int courseCount, int testCount) {
        if (courseCount >= 1) {
            awardAchievement(teacherId, "Course Architect", "Designed and published your first English course!");
        }
        if (testCount >= 3) {
            awardAchievement(teacherId, "Test Master", "Created a robust battery of 3 or more assessment sets.");
        }
    }
}
