package com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.service;

import com.englishwebsite.EnglishWebsite.model.GrammarLesson;
import com.englishwebsite.EnglishWebsite.model.User;
import com.englishwebsite.EnglishWebsite.model.UserProgress;
import com.englishwebsite.EnglishWebsite.model.VocabularyItem;
import com.englishwebsite.EnglishWebsite.repository.GrammarRepository;
import com.englishwebsite.EnglishWebsite.repository.UserProgressRepository;
import com.englishwebsite.EnglishWebsite.repository.UserRepository;
import com.englishwebsite.EnglishWebsite.repository.VocabularyRepository;
import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.GrammarLessonDto;
import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.PlacementTestResultDto;
import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.VocabularyItemDto;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service Nhóm 2 – Placement & Vocabulary & Grammar.
 *
 * Lưu/đọc dữ liệu từ MySQL (JPA).
 */
@Service
public class VocabularyGrammarService {

    private final UserRepository userRepository;
    private final VocabularyRepository vocabularyRepository;
    private final GrammarRepository grammarRepository;
    private final UserProgressRepository userProgressRepository;

    public VocabularyGrammarService(UserRepository userRepository,
                                   VocabularyRepository vocabularyRepository,
                                   GrammarRepository grammarRepository,
                                   UserProgressRepository userProgressRepository) {
        this.userRepository = userRepository;
        this.vocabularyRepository = vocabularyRepository;
        this.grammarRepository = grammarRepository;
        this.userProgressRepository = userProgressRepository;
    }

    @PostConstruct
    public void seedIfEmpty() {
        if (vocabularyRepository.count() == 0) {
            vocabularyRepository.saveAll(List.of(
                new VocabularyItem("V-001", "travel", "du lịch", "I love travel.", "travel", "A1"),
                new VocabularyItem("V-002", "appointment", "cuộc hẹn", "I have an appointment at 3 PM.", "business", "A2")
            ));
        }
        if (grammarRepository.count() == 0) {
            grammarRepository.saveAll(List.of(
                new GrammarLesson("G-001", "Present Simple", "Diễn tả thói quen / sự thật.", "tenses", "A1"),
                new GrammarLesson("G-002", "Past Simple", "Diễn tả hành động đã xảy ra.", "tenses", "A2")
            ));
        }
    }

    public PlacementTestResultDto submitPlacementTest(String userId, Integer score) {
        String uid = userId != null ? userId : "user-demo";
        int s = score != null ? Math.max(0, Math.min(100, score)) : 0;
        String level = mapScoreToLevel(s);

        userRepository.findById(uid).ifPresent(user -> {
            user.setPlacementTestScore(s);
            user.setLevel(level);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        });

        // Save progress record as well
        userProgressRepository.findByUserIdAndItemIdAndType(uid, "placement", "PLACEMENT")
                .map(p -> {
                    p.setCompleted(true);
                    p.setUpdatedAt(LocalDateTime.now());
                    return p;
                })
                .orElse(new UserProgress(uid, "placement", "PLACEMENT", true));

        return new PlacementTestResultDto(uid, s, level, "Placement test submitted and level updated.");
    }

    public List<VocabularyItemDto> listVocabulary(String userId, String topic, String level) {
        String uid = userId != null ? userId : "user-demo";
        List<VocabularyItem> items;
        if (topic != null && level != null) {
            items = vocabularyRepository.findByTopicAndLevel(topic, level);
        } else if (topic != null) {
            items = vocabularyRepository.findByTopic(topic);
        } else if (level != null) {
            items = vocabularyRepository.findByLevel(level);
        } else {
            items = vocabularyRepository.findAll();
        }

        Set<String> learnedIds = userProgressRepository.findByUserIdAndTypeAndCompleted(uid, "VOCAB", true)
                .stream().map(UserProgress::getItemId).collect(Collectors.toSet());

        return items.stream()
                .map(i -> new VocabularyItemDto(i.getId(), i.getWord(), i.getTranslation(), i.getExample(), i.getTopic(), i.getLevel(), learnedIds.contains(i.getId())))
                .sorted(Comparator.comparing(VocabularyItemDto::getId))
                .collect(Collectors.toList());
    }

    public VocabularyItemDto markVocabularyLearned(String userId, String vocabId, boolean learned) {
        String uid = userId != null ? userId : "user-demo";
        VocabularyItem item = vocabularyRepository.findById(vocabId).orElse(null);
        if (item == null) return null;

        UserProgress progress = userProgressRepository.findByUserIdAndItemIdAndType(uid, vocabId, "VOCAB")
                .orElse(new UserProgress(uid, vocabId, "VOCAB", learned));
        progress.setCompleted(learned);
        progress.setUpdatedAt(LocalDateTime.now());
        userProgressRepository.save(progress);

        return new VocabularyItemDto(item.getId(), item.getWord(), item.getTranslation(), item.getExample(), item.getTopic(), item.getLevel(), learned);
    }

    public List<GrammarLessonDto> listGrammarLessons(String userId, String topic, String level) {
        String uid = userId != null ? userId : "user-demo";
        List<GrammarLesson> lessons;
        if (topic != null && level != null) {
            lessons = grammarRepository.findByTopicAndLevel(topic, level);
        } else if (topic != null) {
            lessons = grammarRepository.findByTopic(topic);
        } else if (level != null) {
            lessons = grammarRepository.findByLevel(level);
        } else {
            lessons = grammarRepository.findAll();
        }

        Set<String> completedIds = userProgressRepository.findByUserIdAndTypeAndCompleted(uid, "GRAMMAR", true)
                .stream().map(UserProgress::getItemId).collect(Collectors.toSet());

        return lessons.stream()
                .map(l -> new GrammarLessonDto(l.getId(), l.getTitle(), l.getDescription(), l.getTopic(), l.getLevel(), completedIds.contains(l.getId())))
                .sorted(Comparator.comparing(GrammarLessonDto::getId))
                .collect(Collectors.toList());
    }

    public GrammarLessonDto markGrammarCompleted(String userId, String lessonId, boolean completed) {
        String uid = userId != null ? userId : "user-demo";
        GrammarLesson lesson = grammarRepository.findById(lessonId).orElse(null);
        if (lesson == null) return null;

        UserProgress progress = userProgressRepository.findByUserIdAndItemIdAndType(uid, lessonId, "GRAMMAR")
                .orElse(new UserProgress(uid, lessonId, "GRAMMAR", completed));
        progress.setCompleted(completed);
        progress.setUpdatedAt(LocalDateTime.now());
        userProgressRepository.save(progress);

        return new GrammarLessonDto(lesson.getId(), lesson.getTitle(), lesson.getDescription(), lesson.getTopic(), lesson.getLevel(), completed);
    }

    private String mapScoreToLevel(int score) {
        if (score < 20) return "A1";
        if (score < 40) return "A2";
        if (score < 60) return "B1";
        if (score < 75) return "B2";
        if (score < 90) return "C1";
        return "C2";
    }
}

