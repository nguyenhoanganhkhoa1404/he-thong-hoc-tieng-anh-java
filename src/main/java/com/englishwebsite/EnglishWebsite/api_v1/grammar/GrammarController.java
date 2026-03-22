package com.englishwebsite.EnglishWebsite.api_v1.grammar;

import com.englishwebsite.EnglishWebsite.model.EnglishQuestion;
import com.englishwebsite.EnglishWebsite.repository.EnglishQuestionRepository;
import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.GrammarLessonDto;
import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.service.VocabularyGrammarService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/grammar")
@CrossOrigin(origins = "*")
public class GrammarController {

    private final VocabularyGrammarService service;
    private final EnglishQuestionRepository englishQuestionRepository;

    public GrammarController(VocabularyGrammarService service, EnglishQuestionRepository englishQuestionRepository) {
        this.service = service;
        this.englishQuestionRepository = englishQuestionRepository;
    }

    private String uid(Authentication auth) {
        // Fallback to "user-demo" if not authenticated just like VocabController
        return auth != null ? auth.getName() : "user-demo";
    }

    @GetMapping("/lessons")
    public ResponseEntity<List<GrammarLessonDto>> list(
            Authentication auth,
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String level
    ) {
        return ResponseEntity.ok(service.listGrammarLessons(uid(auth), topic, level));
    }

    @PostMapping("/lessons/{lessonId}/complete")
    public ResponseEntity<GrammarLessonDto> markCompleted(
            Authentication auth,
            @PathVariable String lessonId,
            @RequestParam boolean completed
    ) {
        return ResponseEntity.ok(service.markGrammarCompleted(uid(auth), lessonId, completed));
    }

    @GetMapping("/questions")
    public ResponseEntity<List<EnglishQuestion>> getGrammarQuestions(
            @RequestParam(required = false) Integer categoryId
    ) {
        if (categoryId != null) {
            return ResponseEntity.ok(englishQuestionRepository.findByCategoryId(categoryId));
        }
        return ResponseEntity.ok(englishQuestionRepository.findAll());
    }

    @org.springframework.beans.factory.annotation.Autowired
    private jakarta.persistence.EntityManager entityManager;

    @GetMapping("/debug")
    public ResponseEntity<java.util.Map<String, Object>> debug() {
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        try {
            result.put("englishquestions_count", entityManager.createNativeQuery("SELECT count(*) FROM englishquestions").getSingleResult());
        } catch (Exception e) {
            result.put("englishquestions_count", e.getMessage());
        }
        try {
            result.put("vocabulary_items_count", entityManager.createNativeQuery("SELECT count(*) FROM vocabulary_items").getSingleResult());
        } catch (Exception e) {
            result.put("vocabulary_items_count", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }
}

