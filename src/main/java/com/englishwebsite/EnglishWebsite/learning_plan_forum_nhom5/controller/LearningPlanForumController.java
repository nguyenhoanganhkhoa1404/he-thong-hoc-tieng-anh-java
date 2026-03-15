package com.englishwebsite.EnglishWebsite.learning_plan_forum_nhom5.controller;

import com.englishwebsite.EnglishWebsite.learning_plan_forum_nhom5.dto.AchievementDto;
import com.englishwebsite.EnglishWebsite.learning_plan_forum_nhom5.dto.DailyPlanDto;
import com.englishwebsite.EnglishWebsite.learning_plan_forum_nhom5.dto.ForumPostDto;
import com.englishwebsite.EnglishWebsite.learning_plan_forum_nhom5.service.LearningPlanForumService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller cho module Achievements, Daily Plan & Forum.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LearningPlanForumController {

    private final LearningPlanForumService service;

    public LearningPlanForumController(LearningPlanForumService service) {
        this.service = service;
    }

    // --- Achievement endpoints ---
    @GetMapping("/achievements")
    public ResponseEntity<List<AchievementDto>> getUnlocked(@RequestParam(required = false) String userId) {
        List<AchievementDto> list = service.getAchievementsForUser(userId != null ? userId : "user-demo");
        return ResponseEntity.ok(list);
    }

    @GetMapping("/achievements/available")
    public ResponseEntity<List<AchievementDto>> getAvailable(@RequestParam(required = false) String userId) {
        List<AchievementDto> list = service.getAvailableAchievementsForUser(userId != null ? userId : "user-demo");
        return ResponseEntity.ok(list);
    }

    // --- Daily plan endpoints ---
    @GetMapping("/daily-plan")
    public ResponseEntity<DailyPlanDto> getPlan(@RequestParam String userId, @RequestParam String date) {
        DailyPlanDto plan = service.getPlan(userId, date);
        if (plan == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(plan);
    }

    @PostMapping("/daily-plan")
    public ResponseEntity<DailyPlanDto> createOrUpdatePlan(@RequestBody DailyPlanDto plan) {
        DailyPlanDto saved = service.createOrUpdatePlan(plan);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/daily-plan/{planId}/task/{taskId}")
    public ResponseEntity<DailyPlanDto> markTask(@PathVariable String planId,
                                                 @PathVariable String taskId,
                                                 @RequestParam boolean completed,
                                                 @RequestParam(required = false) String userId) {
        DailyPlanDto updated = service.markTask(userId != null ? userId : "user-demo", planId, taskId, completed);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    // --- Forum endpoints ---
    @GetMapping("/forum/posts")
    public ResponseEntity<List<ForumPostDto>> listPosts() {
        return ResponseEntity.ok(service.listPosts());
    }

    @GetMapping("/forum/posts/{id}")
    public ResponseEntity<ForumPostDto> getPost(@PathVariable String id) {
        ForumPostDto post = service.getPost(id);
        if (post == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(post);
    }

    @PostMapping("/forum/posts")
    public ResponseEntity<ForumPostDto> createPost(@RequestBody ForumPostDto post) {
        ForumPostDto created = service.createPost(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/forum/posts/{id}")
    public ResponseEntity<ForumPostDto> updatePost(@PathVariable String id, @RequestBody ForumPostDto post) {
        ForumPostDto updated = service.updatePost(id, post);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/forum/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        boolean removed = service.deletePost(id);
        if (!removed) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/forum/posts/{id}/comments")
    public ResponseEntity<ForumPostDto> addComment(@PathVariable String id,
                                                   @RequestBody ForumPostDto.CommentDto comment) {
        ForumPostDto updated = service.addComment(id, comment);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }
}
