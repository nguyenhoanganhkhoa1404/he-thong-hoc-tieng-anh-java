package com.englishwebsite.EnglishWebsite.controller;

import com.englishwebsite.EnglishWebsite.model.TestSet;
import com.englishwebsite.EnglishWebsite.model.ReadingPassage;
import com.englishwebsite.EnglishWebsite.model.QuizQuestion;
import com.englishwebsite.EnglishWebsite.repository.TestSetRepository;
import com.englishwebsite.EnglishWebsite.repository.ReadingPassageRepository;
import com.englishwebsite.EnglishWebsite.repository.QuizQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/tests")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private TestSetRepository testSetRepository;

    @Autowired
    private ReadingPassageRepository readingPassageRepository;

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    @GetMapping
    public List<TestSet> getAllTests() {
        return testSetRepository.findAll();
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<?> getTestDetails(@PathVariable String id) {
        Optional<TestSet> testSet = testSetRepository.findById(id);
        if (testSet.isEmpty()) return ResponseEntity.notFound().build();

        // 1. Find passage linked to this test
        Optional<ReadingPassage> passage = readingPassageRepository.findById(id);
        ReadingPassage finalPassage = passage.orElse(null);
        
        // Fallback: If no dedicated passage exists, create a dummy one using TestSet description
        if (finalPassage == null && testSet.get().getDescription() != null) {
            finalPassage = new ReadingPassage();
            finalPassage.setId(id);
            finalPassage.setTitle(testSet.get().getName());
            finalPassage.setContent(testSet.get().getDescription());
        }

        // 2. Find questions linked to this test (check both lessonId and testSetId)
        List<QuizQuestion> questions = quizQuestionRepository.findByLessonId(id);
        if (questions.isEmpty()) {
            questions = quizQuestionRepository.findByTestSetId(id);
        }

        Map<String, Object> details = new HashMap<>();
        details.put("test", testSet.get());
        details.put("passage", finalPassage);
        details.put("questions", questions);

        return ResponseEntity.ok(details);
    }

    @PostMapping("/publish")
    public ResponseEntity<?> publishTest(@RequestBody Map<String, Object> request) {
        String id = (String) request.get("id");
        String name = (String) request.get("name");
        String type = (String) request.get("type");
        String level = (String) request.get("level");
        String description = (String) request.get("description");
        int duration = (int) request.get("duration");

        // Save TestSet
        TestSet testSet = new TestSet();
        testSet.setId(id);
        testSet.setName(name);
        testSet.setType(type);
        testSet.setLevel(level);
        testSet.setDescription(description);
        testSet.setDuration(duration);
        testSetRepository.save(testSet);

        // Save Passage if provided
        String passageContent = (String) request.get("passageContent");
        if (passageContent != null) {
            ReadingPassage passage = new ReadingPassage();
            passage.setId(id);
            passage.setTitle(name);
            passage.setContent(passageContent);
            passage.setLevel(level);
            readingPassageRepository.save(passage);
        }

        // Save Questions
        List<Map<String, Object>> questionsData = (List<Map<String, Object>>) request.get("questions");
        if (questionsData != null) {
            for (int i = 0; i < questionsData.size(); i++) {
                Map<String, Object> qData = questionsData.get(i);
                QuizQuestion q = new QuizQuestion();
                q.setId(id + "_q" + (i + 1));
                q.setLessonId(id);
                q.setQuestionText((String) qData.get("text"));
                q.setOptionsJson((String) qData.get("options")); // Expecting JSON string or comma-sep
                q.setCorrectAnswer((String) qData.get("correct"));
                q.setOrder(i + 1);
                q.setDifficultyLevel(level);
                quizQuestionRepository.save(q);
            }
        }

        return ResponseEntity.ok("Test published successfully!");
    }
}
