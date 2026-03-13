package com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.controller;

import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.*;
import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.service.VocabularyGrammarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vocab-grammar")
@CrossOrigin(origins = "*")
public class VocabularyGrammarController {

    @Autowired
    private VocabularyGrammarService service;

    // ======================================================
    // CHỨC NĂNG 4: KIỂM TRA ĐẦU VÀO (PLACEMENT TEST)
    // ======================================================
    
    @GetMapping("/placement-test")
    public ResponseEntity<List<QuestionDto>> getPlacementTest() {
        return ResponseEntity.ok(service.getPlacementQuestions());
    }

    @PostMapping("/placement-test/submit")
    public ResponseEntity<PlacementTestResultDto> submitPlacementTest(@RequestBody PlacementSubmissionDto submission) {
        PlacementTestResultDto result = service.gradePlacementTest(submission);
        return ResponseEntity.ok(result);
    }

    // ======================================================
    // CHỨC NĂNG 5: HỌC TỪ VỰNG (VOCABULARY)
    // ======================================================
    
    @GetMapping("/vocabulary")
    public ResponseEntity<List<VocabularyItemDto>> getVocabulary(
            @RequestParam(defaultValue = "travel") String topic,
            @RequestParam(defaultValue = "A1") String level) {
        return ResponseEntity.ok(service.getVocabulary(topic, level));
    }

    @PostMapping("/vocabulary/mark-learned/{id}")
    public ResponseEntity<String> markLearned(@PathVariable String id) {
        service.markAsLearned(id);
        return ResponseEntity.ok("Cập nhật trạng thái thành công!");
    }

    // ======================================================
    // CHỨC NĂNG 6: HỌC NGỮ PHÁP (GRAMMAR)
    // ======================================================

    // API lấy lý thuyết bài học
    @GetMapping("/grammar")
    public ResponseEntity<List<GrammarLessonDto>> getGrammar(
            @RequestParam(defaultValue = "A1") String level) {
        return ResponseEntity.ok(service.getGrammarLessons(level));
    }

    // API MỚI: Lấy danh sách bài tập thực hành theo level
    @GetMapping("/grammar/exercises")
    public ResponseEntity<List<GrammarExerciseDto>> getExercises(@RequestParam String level) {
        return ResponseEntity.ok(service.getExercisesByLevel(level));
    }
}