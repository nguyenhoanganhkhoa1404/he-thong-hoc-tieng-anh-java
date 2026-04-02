package com.englishwebsite.EnglishWebsite.config;

import com.englishwebsite.EnglishWebsite.model.Achievement;
import com.englishwebsite.EnglishWebsite.model.User;
import com.englishwebsite.EnglishWebsite.repository.AchievementRepository;
import com.englishwebsite.EnglishWebsite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Component
public class AchievementSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AchievementRepository achievementRepository;

    @Override
    public void run(String... args) throws Exception {
        // Find existing users and give them initial achievements if they have none
        List<User> users = userRepository.findAll();
        for (User user : users) {
             List<Achievement> existing = achievementRepository.findByUserId(user.getUid());
             if (existing.isEmpty()) {
                 award(user.getUid(), "First Login", "Logged into the system for the first time.");
                 award(user.getUid(), "Keen Learner", "Viewed the dashboard and started learning.");
             }
        }
    }

    private void award(String userId, String name, String description) {
        Achievement achievement = new Achievement();
        achievement.setId(UUID.randomUUID().toString());
        achievement.setUserId(userId);
        achievement.setName(name);
        achievement.setDescription(description);
        achievement.setUnlocked(true);
        achievement.setDateUnlocked(LocalDateTime.now());
        achievementRepository.save(achievement);
    }
}
