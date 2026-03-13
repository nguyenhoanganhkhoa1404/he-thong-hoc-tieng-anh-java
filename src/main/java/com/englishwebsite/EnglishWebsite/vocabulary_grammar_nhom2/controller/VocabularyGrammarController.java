package com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.controller;

import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.PlacementSubmissionDto;
import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.PlacementTestResultDto;
import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.QuestionDto;
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

    // API 1: Lấy danh sách câu hỏi đầu vào
    @GetMapping("/placement-test")
    public ResponseEntity<List<QuestionDto>> getPlacementTest() {
        return ResponseEntity.ok(service.getPlacementQuestions());
    }

    // API 2: Nộp bài và nhận điểm
    @PostMapping("/placement-test/submit")
    public ResponseEntity<PlacementTestResultDto> submitPlacementTest(@RequestBody PlacementSubmissionDto submission) {
        PlacementTestResultDto result = service.gradePlacementTest(submission);
        return ResponseEntity.ok(result);
    }
}