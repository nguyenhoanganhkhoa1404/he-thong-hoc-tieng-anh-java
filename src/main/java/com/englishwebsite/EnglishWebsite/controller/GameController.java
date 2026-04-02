package com.englishwebsite.EnglishWebsite.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/games")
public class GameController {

    @Autowired
    private com.englishwebsite.EnglishWebsite.auth_nhom1.service.UserService userService;

    @Autowired
    private com.englishwebsite.EnglishWebsite.repository.VocabularyRepository vocabularyRepository;

    @Autowired
    private com.englishwebsite.EnglishWebsite.repository.GrammarRepository grammarRepository;

    @GetMapping("/challenge")
    public ResponseEntity<?> getChallenge(@RequestParam String mode) {
        Random rand = new Random();
        
        if ("grammar".equals(mode)) {
            List<com.englishwebsite.EnglishWebsite.model.GrammarLesson> lessons = grammarRepository.findAll();
            if (lessons.isEmpty()) return ResponseEntity.ok(Map.of("q", "No grammar lessons yet!", "a", "none", "hint", "Add data"));
            com.englishwebsite.EnglishWebsite.model.GrammarLesson lesson = lessons.get(rand.nextInt(lessons.size()));
            return ResponseEntity.ok(Map.of(
                "q", "Which lesson covers: " + lesson.getDescription(),
                "a", lesson.getTitle(),
                "hint", lesson.getTopic()
            ));
        }

        List<com.englishwebsite.EnglishWebsite.model.VocabularyItem> items = vocabularyRepository.findAll();
        if (items.isEmpty()) {
            return ResponseEntity.ok(Map.of("word", "GALAXY", "scrambled", "YXALAG", "hint", "Default Data"));
        }
        com.englishwebsite.EnglishWebsite.model.VocabularyItem item = items.get(rand.nextInt(items.size()));

        switch (mode) {
            case "scramble":
                return ResponseEntity.ok(Map.of(
                    "word", item.getWord(),
                    "scrambled", shuffle(item.getWord()),
                    "hint", item.getTranslation()
                ));
            case "listening":
                return ResponseEntity.ok(Map.of("word", item.getWord(), "hint", item.getTopic()));
            case "match":
                return ResponseEntity.ok(Map.of("q", "Meaning of '" + item.getWord() + "'?", "a", item.getTranslation(), "hint", item.getTopic()));
            case "bubble":
                return ResponseEntity.ok(Map.of("q", "Translate: " + item.getTranslation(), "a", item.getWord(), "hint", item.getTopic()));
            default:
                return ResponseEntity.badRequest().body("Unknown mode");
        }
    }

    private String shuffle(String s) {
        List<String> chars = Arrays.asList(s.split(""));
        Collections.shuffle(chars);
        return String.join("", chars).toUpperCase();
    }

    @PostMapping("/score")
    public ResponseEntity<?> saveScore(@RequestBody Map<String, Object> scoreData) {
        String userId = (String) scoreData.get("userId");
        Integer score = (Integer) scoreData.get("score");
        if (userId != null && score != null) {
            userService.addXp(userId, score / 2); // XP bonus is half the score
            userService.updateStreak(userId);
        }
        return ResponseEntity.ok(Map.of("status", "success", "message", "Score saved and XP added!"));
    }
}
