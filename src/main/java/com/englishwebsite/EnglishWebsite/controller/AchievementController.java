package com.englishwebsite.EnglishWebsite.controller;

import com.englishwebsite.EnglishWebsite.model.Achievement;
import com.englishwebsite.EnglishWebsite.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
@CrossOrigin(origins = "*")
public class AchievementController {

    @Autowired
    private AchievementService achievementService;

    @GetMapping("/user/{userId}")
    public List<Achievement> getUserAchievements(@PathVariable String userId) {
        return achievementService.getUserAchievements(userId);
    }

    @PostMapping("/award")
    public ResponseEntity<Achievement> awardAchievement(@RequestParam String userId, 
                                                       @RequestParam String name, 
                                                       @RequestParam String description) {
        Achievement achievement = achievementService.awardAchievement(userId, name, description);
        return ResponseEntity.ok(achievement);
    }
}
