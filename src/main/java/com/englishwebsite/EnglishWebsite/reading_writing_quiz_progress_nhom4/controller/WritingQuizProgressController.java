package com.englishwebsite.EnglishWebsite.reading_writing_quiz_progress_nhom4.controller;

import com.englishwebsite.EnglishWebsite.reading_writing_quiz_progress_nhom4.dto.*;
import com.englishwebsite.EnglishWebsite.reading_writing_quiz_progress_nhom4.service.WritingQuizProgressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Nhóm 4 – Writing, Quiz & Progress (Mai).
 * Chức năng 10: Writing | 11: Quiz | 12: Progress.
 */
@RestController
@RequestMapping("/api/writing-quiz-progress")
@CrossOrigin(origins = "*")
public class WritingQuizProgressController {

    private final WritingQuizProgressService service;

    public WritingQuizProgressController(WritingQuizProgressService service) {
        this.service = service;
    }

    @PostMapping("/writing/submit")
    public ResponseEntity<WritingExerciseDto> submitWriting(@RequestBody WritingSubmitRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.submitWriting(request));
    }

    @GetMapping("/writing/user/{userId}")
    public ResponseEntity<List<WritingExerciseDto>> getWritingsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(service.getWritingsByUser(userId));
    }

    @GetMapping("/writing/{id}")
    public ResponseEntity<WritingExerciseDto> getWritingById(@PathVariable String id) {
        return service.getWritingById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/quiz/questions")
    public ResponseEntity<List<QuizQuestionDto>> getAllQuizQuestions(
            @RequestParam(required = false) Integer limit
    ) {
        return ResponseEntity.ok(service.getAllQuestions(limit));
    }

    @GetMapping("/quiz/lesson/{lessonId}/questions")
    public ResponseEntity<List<QuizQuestionDto>> getQuizQuestions(@PathVariable String lessonId) {
        return ResponseEntity.ok(service.getQuestionsByLesson(lessonId));
    }

    @PostMapping("/quiz/submit")
    public ResponseEntity<QuizResultResponse> submitQuizResult(@RequestBody QuizResultRequest request) {
        return ResponseEntity.ok(service.submitQuizResult(request));
    }

    @GetMapping("/progress/user/{userId}")
    public ResponseEntity<ProgressOverviewDto> getProgressOverview(@PathVariable String userId) {
        return ResponseEntity.ok(service.getProgressOverview(userId));
    }
}
