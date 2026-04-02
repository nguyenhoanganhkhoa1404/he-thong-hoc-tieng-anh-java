package com.englishwebsite.EnglishWebsite.controller;

import com.englishwebsite.EnglishWebsite.model.Submission;
import com.englishwebsite.EnglishWebsite.model.TestSet;
import com.englishwebsite.EnglishWebsite.model.User;
import com.englishwebsite.EnglishWebsite.repository.SubmissionRepository;
import com.englishwebsite.EnglishWebsite.repository.TestSetRepository;
import com.englishwebsite.EnglishWebsite.repository.UserRepository;
import com.englishwebsite.EnglishWebsite.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/submissions")
@CrossOrigin(origins = "*")
public class SubmissionController {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final TestSetRepository testSetRepository;
    private final AIService aiService;

    public SubmissionController(SubmissionRepository submissionRepository,
                               UserRepository userRepository,
                               TestSetRepository testSetRepository,
                               AIService aiService) {
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
        this.testSetRepository = testSetRepository;
        this.aiService = aiService;
    }

    @PostMapping("/writing")
    public ResponseEntity<?> submitWriting(@RequestBody Map<String, String> body) {
        String uid = body.getOrDefault("userId", "user-demo");
        String testSetId = body.get("testSetId");
        String content = body.get("content");
        String prompt = body.getOrDefault("prompt", "General Writing");

        User user = userRepository.findById(uid).orElse(null);
        TestSet testSet = testSetId != null ? testSetRepository.findById(testSetId).orElse(null) : null;

        Map<String, Object> aiResult = aiService.analyzeWriting(content, prompt);

        Submission submission = new Submission();
        submission.setId(UUID.randomUUID().toString());
        submission.setUser(user);
        submission.setTestSet(testSet);
        submission.setSubmissionType("WRITING");
        submission.setContent(content);
        submission.setScore((Double) aiResult.get("score"));
        submission.setAiFeedback((String) aiResult.get("feedback"));
        submission.setCreatedAt(LocalDateTime.now());

        submissionRepository.save(submission);

        return ResponseEntity.ok(aiResult);
    }
}
