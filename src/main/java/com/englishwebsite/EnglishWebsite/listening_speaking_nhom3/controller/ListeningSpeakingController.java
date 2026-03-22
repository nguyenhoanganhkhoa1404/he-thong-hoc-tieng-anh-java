package com.englishwebsite.EnglishWebsite.listening_speaking_nhom3.controller;

import com.englishwebsite.EnglishWebsite.listening_speaking_nhom3.dto.*;
import com.englishwebsite.EnglishWebsite.listening_speaking_nhom3.service.ListeningSpeakingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Nhóm 3 – Học kỹ năng nghe & nói.
 */
@RestController
@RequestMapping("/api/listening-speaking")
@CrossOrigin(origins = "*")
public class ListeningSpeakingController {

    private final ListeningSpeakingService service;

    public ListeningSpeakingController(ListeningSpeakingService service) {
        this.service = service;
    }

    // --- Nghe ---

    @GetMapping("/listening/lessons")
    public ResponseEntity<List<ListeningLessonDto>> listListeningLessons() {
        return ResponseEntity.ok(service.listListeningLessons());
    }

    @GetMapping("/listening/lessons/{lessonId}")
    public ResponseEntity<ListeningLessonDto> getListeningLesson(@PathVariable String lessonId) {
        return service.getListeningLesson(lessonId).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/listening/lessons/{lessonId}/questions")
    public ResponseEntity<List<ListeningQuestionDto>> getListeningQuestions(@PathVariable String lessonId) {
        return ResponseEntity.ok(service.getListeningQuestions(lessonId));
    }

    @PostMapping("/listening/submit")
    public ResponseEntity<ListeningResultResponse> submitListening(@RequestBody ListeningSubmitRequest request) {
        return ResponseEntity.ok(service.submitListening(request));
    }

    @GetMapping("/listening/results/user/{userId}")
    public ResponseEntity<List<ListeningResultResponse>> getListeningResults(@PathVariable String userId) {
        return ResponseEntity.ok(service.getListeningResultsByUser(userId));
    }

    // --- Nói ---

    @GetMapping("/speaking/lessons/{lessonId}/prompts")
    public ResponseEntity<List<SpeakingPromptDto>> getSpeakingPrompts(@PathVariable String lessonId) {
        return ResponseEntity.ok(service.getSpeakingPrompts(lessonId));
    }

    @PostMapping("/speaking/submit")
    public ResponseEntity<SpeakingAttemptDto> submitSpeaking(@RequestBody SpeakingSubmitRequest request) {
        if (request.getPromptId() == null)
            return ResponseEntity.badRequest().build();
        if (service.findPromptById(request.getPromptId()).isEmpty())
            return ResponseEntity.notFound().build();
        return ResponseEntity.status(HttpStatus.CREATED).body(service.submitSpeaking(request));
    }

    @GetMapping("/speaking/attempts/user/{userId}")
    public ResponseEntity<List<SpeakingAttemptDto>> getSpeakingAttempts(@PathVariable String userId) {
        return ResponseEntity.ok(service.getSpeakingAttemptsByUser(userId));
    }

    @GetMapping("/speaking/attempts/{id}")
    public ResponseEntity<SpeakingAttemptDto> getSpeakingAttempt(@PathVariable String id) {
        return service.getSpeakingAttemptById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
