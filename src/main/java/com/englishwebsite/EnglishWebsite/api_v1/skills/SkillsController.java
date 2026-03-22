package com.englishwebsite.EnglishWebsite.api_v1.skills;

import com.englishwebsite.EnglishWebsite.model.EnglishLesson;
import com.englishwebsite.EnglishWebsite.repository.EnglishLessonRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/skills")
@CrossOrigin(origins = "*")
public class SkillsController {

    private final EnglishLessonRepository repository;

    public SkillsController(EnglishLessonRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/lessons")
    public ResponseEntity<List<EnglishLesson>> getLessonsBySkill(
            @RequestParam(required = true) String skill
    ) {
        // skill should be LISTENING, SPEAKING, READING, WRITING
        return ResponseEntity.ok(repository.findBySkill(skill.toUpperCase()));
    }
}
