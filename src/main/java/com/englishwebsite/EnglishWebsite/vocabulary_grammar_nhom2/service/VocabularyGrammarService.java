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
        if (grammarRepository.count() <= 2) {
            grammarRepository.deleteAll(); // clear the old basic 2 items
            grammarRepository.saveAll(List.of(
                // ---- TENSES ----
                new GrammarLesson("G-T-01", "Present Simple", "Diễn tả thói quen, sự thật hiển nhiên, chân lý.", "tenses", "A1"),
                new GrammarLesson("G-T-02", "Present Continuous", "Diễn tả hành động đang xảy ra tại thời điểm nói.", "tenses", "A1"),
                new GrammarLesson("G-T-03", "Past Simple", "Diễn tả hành động đã xảy ra và kết thúc trong quá khứ.", "tenses", "A2"),
                new GrammarLesson("G-T-04", "Past Continuous", "Diễn tả hành động đang xảy ra tại một thời điểm cụ thể trong quá khứ.", "tenses", "A2"),
                new GrammarLesson("G-T-05", "Present Perfect", "Diễn tả hành động xảy ra trong quá khứ nhưng kết quả còn lưu đến hiện tại.", "tenses", "B1"),
                new GrammarLesson("G-T-06", "Present Perfect Continuous", "Nhấn mạnh quá trình của một hành động bắt đầu trong quá khứ và kéo dài đến hiện tại.", "tenses", "B2"),
                new GrammarLesson("G-T-07", "Future Simple", "Diễn tả dự đoán, quyết định tức thời, hoặc lời hứa.", "tenses", "A2"),
                new GrammarLesson("G-T-08", "Future Continuous", "Diễn tả hành động sẽ đang xảy ra tại một thời điểm trong tương lai.", "tenses", "B1"),
                
                // ---- NOUNS & PRONOUNS ----
                new GrammarLesson("G-N-01", "Countable & Uncountable Nouns", "Danh từ đếm được (apple) và không đếm được (water).", "nouns", "A1"),
                new GrammarLesson("G-N-02", "Plural Nouns (Regular/Irregular)", "Quy tắc thêm s/es và các danh từ bất quy tắc (child -> children).", "nouns", "A1"),
                new GrammarLesson("G-N-03", "Subject & Object Pronouns", "Cách sử dụng I, me, he, him, they, them...", "nouns", "A1"),
                new GrammarLesson("G-N-04", "Possessive Pronouns & Adjectives", "Sự khác biệt giữa my, mine, your, yours...", "nouns", "A2"),
                new GrammarLesson("G-N-05", "Reflexive Pronouns", "Sử dụng myself, yourself, themselves...", "nouns", "B1"),
                
                // ---- VERBS ----
                new GrammarLesson("G-V-01", "Modal Verbs (Can, Must, Should)", "Động từ khuyết thiếu diễn tả khả năng, sự bắt buộc, lời khuyên.", "verbs", "A2"),
                new GrammarLesson("G-V-02", "Gerund vs Infinitive", "Khi nào dùng V-ing, khi nào dùng To V.", "verbs", "B1"),
                new GrammarLesson("G-V-03", "Phrasal Verbs (Basic)", "Cụm động từ cơ bản (get up, look for, put on).", "verbs", "A2"),
                new GrammarLesson("G-V-04", "Phrasal Verbs (Advanced)", "Cụm động từ nâng cao (bring about, turn out).", "verbs", "C1"),
                new GrammarLesson("G-V-05", "Passive Voice", "Câu bị động ở các thì cơ bản và nâng cao.", "verbs", "B1"),
                
                // ---- ADJECTIVES & ADVERBS ----
                new GrammarLesson("G-A-01", "Comparative Adjectives", "So sánh hơn (taller, more beautiful).", "adjectives", "A2"),
                new GrammarLesson("G-A-02", "Superlative Adjectives", "So sánh nhất (the tallest, the most beautiful).", "adjectives", "A2"),
                new GrammarLesson("G-A-03", "Adverbs of Frequency", "Trạng từ chỉ tần suất (always, usually, sometimes) và vị trí.", "adjectives", "A1"),
                new GrammarLesson("G-A-04", "Adjectives ending in -ed vs -ing", "Sự khác nhau giữa bored và boring, interested và interesting.", "adjectives", "B1"),
                
                // ---- PREPOSITIONS & CONJUNCTIONS ----
                new GrammarLesson("G-P-01", "Prepositions of Time (in, on, at)", "Cách dùng giới từ thời gian cơ bản.", "prepositions", "A1"),
                new GrammarLesson("G-P-02", "Prepositions of Place (in, on, at)", "Cách dùng giới từ nơi chốn cơ bản.", "prepositions", "A1"),
                new GrammarLesson("G-P-03", "Coordinating Conjunctions (FANBOYS)", "Từ nối phổ biến: For, And, Nor, But, Or, Yet, So.", "prepositions", "A2"),
                new GrammarLesson("G-P-04", "Subordinating Conjunctions", "Từ nối mệnh đề phụ: Although, Because, While, If...", "prepositions", "B1"),
                
                // ---- SENTENCE STRUCTURES ----
                new GrammarLesson("G-S-01", "Conditional Sentences Type 0, 1", "Câu điều kiện loại 0 (hiển nhiên) và 1 (có thể xảy ra).", "sentences", "A2"),
                new GrammarLesson("G-S-02", "Conditional Sentences Type 2", "Câu điều kiện loại 2 (trái với hiện tại).", "sentences", "B1"),
                new GrammarLesson("G-S-03", "Conditional Sentences Type 3", "Câu điều kiện loại 3 (trái với quá khứ).", "sentences", "B2"),
                new GrammarLesson("G-S-04", "Mixed Conditionals", "Câu điều kiện hỗn hợp.", "sentences", "C1"),
                new GrammarLesson("G-S-05", "Relative Clauses", "Mệnh đề quan hệ (who, which, that, whose).", "sentences", "B1"),
                new GrammarLesson("G-S-06", "Reported Speech", "Câu tường thuật (chuyển đổi thì, đại từ, trạng từ).", "sentences", "B2"),
                new GrammarLesson("G-S-07", "Inversion", "Đảo ngữ (Never have I ever, Not only... but also).", "sentences", "C1")
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

