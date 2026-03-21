package com.englishwebsite.EnglishWebsite.api_v1.vocab;

import com.englishwebsite.EnglishWebsite.auth_nhom1.service.UserService;
import com.englishwebsite.EnglishWebsite.model.User;
import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.VocabularyItemDto;
import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.service.VocabularyGrammarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/vocab")
@CrossOrigin(origins = "*")
public class VocabController {

    private final VocabularyGrammarService service;
    
    @Autowired
    private UserService userService;

    public VocabController(VocabularyGrammarService service) {
        this.service = service;
    }

    @GetMapping("/items")
    public ResponseEntity<List<VocabularyItemDto>> list(
            Authentication auth,
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String level
    ) {
        return ResponseEntity.ok(service.listVocabulary(uid(auth), topic, level));
    }

    @PostMapping("/flashcards/next")
    public ResponseEntity<VocabularyItemDto> nextFlashcard(
            Authentication auth,
            @RequestBody(required = false) Map<String, Object> body
    ) {
        String level = body != null && body.get("level") != null ? String.valueOf(body.get("level")) : null;
        String topic = body != null && body.get("topic") != null ? String.valueOf(body.get("topic")) : null;
        List<VocabularyItemDto> items = service.listVocabulary(uid(auth), topic, level);
        
        VocabularyItemDto next = items.stream().filter(v -> !v.isLearned()).findFirst().orElse(null);
        
        if (next == null) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(next);
    }

    @PutMapping("/items/{id}/learned")
    public ResponseEntity<VocabularyItemDto> markLearned(
            Authentication auth,
            @PathVariable String id,
            @RequestParam(defaultValue = "true") boolean learned
    ) {
        VocabularyItemDto updated = service.markVocabularyLearned(uid(auth), id, learned);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    private String uid(Authentication auth) {
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            User user = userService.getUserByEmail(auth.getName());
            if (user != null) return user.getUid();
        }
        return "user-demo";
    }
}

