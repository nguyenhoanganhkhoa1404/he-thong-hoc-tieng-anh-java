package com.englishwebsite.EnglishWebsite.reading_writing_quiz_progress_nhom4.controller;

import com.englishwebsite.EnglishWebsite.reading_writing_quiz_progress_nhom4.dto.*;
import com.englishwebsite.EnglishWebsite.reading_writing_quiz_progress_nhom4.service.ReadingComprehensionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Học kỹ năng đọc hiểu – đoạn văn + câu hỏi.
 */
@RestController
@RequestMapping("/api/reading")
@CrossOrigin(origins = "*")
public class ReadingComprehensionController {

    private final ReadingComprehensionService service;

    public ReadingComprehensionController(ReadingComprehensionService service) {
        this.service = service;
    }

    @GetMapping("/passages")
    public ResponseEntity<List<ReadingPassageDto>> listPassages() {
        return ResponseEntity.ok(service.listPassages());
    }

    @GetMapping("/passages/{passageId}")
    public ResponseEntity<ReadingPassageDto> getPassage(@PathVariable String passageId) {
        return service.getPassage(passageId).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/passages/{passageId}/questions")
    public ResponseEntity<List<ReadingQuestionDto>> getQuestions(@PathVariable String passageId) {
        return ResponseEntity.ok(service.getQuestions(passageId));
    }

    @PostMapping("/submit")
    public ResponseEntity<ReadingResultResponse> submit(@RequestBody ReadingSubmitRequest request) {
        if (request.getPassageId() == null || service.getPassage(request.getPassageId()).isEmpty())
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(service.submit(request));
    }

    @GetMapping("/results/user/{userId}")
    public ResponseEntity<List<ReadingResultResponse>> getResults(@PathVariable String userId) {
        return ResponseEntity.ok(service.getResultsByUser(userId));
    }
}
