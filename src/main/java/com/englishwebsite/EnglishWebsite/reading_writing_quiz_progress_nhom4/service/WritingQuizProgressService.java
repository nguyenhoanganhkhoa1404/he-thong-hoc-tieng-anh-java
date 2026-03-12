package com.englishwebsite.EnglishWebsite.reading_writing_quiz_progress_nhom4.service;

import com.englishwebsite.EnglishWebsite.reading_writing_quiz_progress_nhom4.dto.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * Service Nhóm 4 – Writing, Quiz & Progress.
 * Chức năng 10: Writing | 11: Quiz | 12: Progress. In-memory demo.
 */
@Service
public class WritingQuizProgressService {

    private final Map<String, WritingExerciseDto> writings = new HashMap<>();
    private final Map<String, List<QuizQuestionDto>> questionsByLesson = new HashMap<>();
    private final Map<String, List<QuizResultResponse>> quizResultsByUser = new HashMap<>();
    private final AtomicLong writingIdGen = new AtomicLong(1);
    private final AtomicLong questionIdGen = new AtomicLong(1);

    public WritingExerciseDto submitWriting(WritingSubmitRequest request) {
        String userId = request.getUserId() != null ? request.getUserId() : "user-demo";
        String id = "W-" + writingIdGen.getAndIncrement();
        WritingExerciseDto dto = new WritingExerciseDto();
        dto.setId(id);
        dto.setUserId(userId);
        dto.setLessonId(request.getLessonId());
        dto.setPrompt(request.getPrompt());
        dto.setContent(request.getContent());
        dto.setCreatedAt(LocalDateTime.now());
        dto.setFeedback(generateSimpleFeedback(request.getContent()));
        dto.setScore(estimateScore(request.getContent()));
        writings.put(id, dto);
        return dto;
    }

    private String generateSimpleFeedback(String content) {
        if (content == null || content.trim().isEmpty())
            return "Bạn chưa nhập nội dung. Hãy viết ít nhất một câu hoàn chỉnh.";
        int words = content.trim().split("\\s+").length;
        if (words < 5) return "Gợi ý: Thử viết dài hơn (ít nhất 5–10 từ).";
        String t = content.trim();
        if (!t.endsWith(".") && !t.endsWith("!") && !t.endsWith("?"))
            return "Gợi ý: Nên kết thúc câu bằng dấu chấm (.), ! hoặc ?.";
        return "Bài viết ổn. Tiếp tục luyện tập.";
    }

    private Integer estimateScore(String content) {
        if (content == null || content.trim().isEmpty()) return 0;
        int words = content.trim().split("\\s+").length;
        if (words < 3) return 3;
        if (words < 7) return 5;
        if (words < 15) return 7;
        return Math.min(10, 7 + words / 10);
    }

    public List<WritingExerciseDto> getWritingsByUser(String userId) {
        return writings.values().stream()
                .filter(w -> userId != null && userId.equals(w.getUserId()))
                .sorted(Comparator.comparing(WritingExerciseDto::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());
    }

    public Optional<WritingExerciseDto> getWritingById(String id) {
        return Optional.ofNullable(writings.get(id));
    }

    public List<QuizQuestionDto> getQuestionsByLesson(String lessonId) {
        List<QuizQuestionDto> list = questionsByLesson.get(lessonId);
        if (list != null) return new ArrayList<>(list);
        return createDemoQuestions(lessonId);
    }

    private List<QuizQuestionDto> createDemoQuestions(String lessonId) {
        List<QuizQuestionDto> list = new ArrayList<>();
        for (String[] row : new String[][]{
                {"She _____ to school every day.", "goes", "go", "goes", "going", "went"},
                {"Past tense of 'buy'?", "bought", "buyed", "bought", "buys", "buying"}
        }) {
            QuizQuestionDto q = new QuizQuestionDto();
            q.setId("Q-" + questionIdGen.getAndIncrement());
            q.setLessonId(lessonId);
            q.setType("MULTIPLE_CHOICE");
            q.setQuestionText(row[0]);
            q.setOptions(Arrays.asList(row[2], row[3], row[4], row[5]));
            q.setCorrectAnswer(row[1]);
            q.setOrder(list.size() + 1);
            list.add(q);
        }
        QuizQuestionDto q3 = new QuizQuestionDto();
        q3.setId("Q-" + questionIdGen.getAndIncrement());
        q3.setLessonId(lessonId);
        q3.setType("FILL_BLANK");
        q3.setQuestionText("I _____ (to be) a student. Fill: am / is / are");
        q3.setCorrectAnswers(Collections.singletonList("am"));
        q3.setOrder(3);
        list.add(q3);
        questionsByLesson.put(lessonId, list);
        return new ArrayList<>(list);
    }

    public QuizResultResponse submitQuizResult(QuizResultRequest request) {
        String userId = request.getUserId() != null ? request.getUserId() : "user-demo";
        List<QuizQuestionDto> questions = getQuestionsByLesson(request.getLessonId());
        Map<String, String> answers = request.getAnswers() != null ? request.getAnswers() : new HashMap<>();
        int score = 0;
        for (QuizQuestionDto q : questions) {
            String userAnswer = answers.get(q.getId());
            if (userAnswer == null) continue;
            if ("MULTIPLE_CHOICE".equals(q.getType()) && userAnswer.trim().equalsIgnoreCase(q.getCorrectAnswer() != null ? q.getCorrectAnswer().trim() : ""))
                score++;
            else if (q.getCorrectAnswers() != null && !q.getCorrectAnswers().isEmpty()
                    && q.getCorrectAnswers().stream().anyMatch(c -> c != null && c.trim().equalsIgnoreCase(userAnswer.trim())))
                score++;
        }
        QuizResultResponse resp = new QuizResultResponse();
        resp.setUserId(userId);
        resp.setLessonId(request.getLessonId());
        resp.setScore(score);
        resp.setTotalQuestions(questions.size());
        resp.setPassed(questions.isEmpty() || (double) score / questions.size() >= 0.6);
        resp.setTimeSpentSeconds(request.getTimeSpentSeconds());
        quizResultsByUser.computeIfAbsent(userId, k -> new ArrayList<>()).add(resp);
        return resp;
    }

    public ProgressOverviewDto getProgressOverview(String userId) {
        String uid = userId != null ? userId : "user-demo";
        ProgressOverviewDto overview = new ProgressOverviewDto();
        overview.setUserId(uid);
        List<WritingExerciseDto> userWritings = getWritingsByUser(uid);
        int writingCount = userWritings.size();
        double writingAvg = userWritings.stream().filter(w -> w.getScore() != null).mapToInt(WritingExerciseDto::getScore).average().orElse(0);
        List<QuizResultResponse> userQuizResults = quizResultsByUser.getOrDefault(uid, Collections.emptyList());
        int quizCount = userQuizResults.size();
        int totalQuestions = userQuizResults.stream().mapToInt(QuizResultResponse::getTotalQuestions).sum();
        int totalScore = userQuizResults.stream().mapToInt(QuizResultResponse::getScore).sum();
        double quizAvg = totalQuestions > 0 ? totalScore * 10.0 / totalQuestions : 0;
        overview.setTotalLessonsCompleted(writingCount + quizCount);
        if (writingCount + quizCount > 0)
            overview.setAverageScore(Math.round((writingAvg * writingCount + quizAvg * quizCount) / (writingCount + quizCount) * 10) / 10.0);
        else overview.setAverageScore(0);
        overview.setCurrentLevel(overview.getAverageScore() >= 8 ? "B1" : overview.getAverageScore() >= 5 ? "A2" : "A1");
        overview.getBySkill().put("writing", new SkillProgressDto()); overview.getBySkill().get("writing").setCompletedLessons(writingCount); overview.getBySkill().get("writing").setAverageScore(writingAvg); overview.getBySkill().get("writing").setLevel(overview.getCurrentLevel());
        overview.getBySkill().put("reading", new SkillProgressDto()); overview.getBySkill().get("reading").setCompletedLessons(quizCount); overview.getBySkill().get("reading").setAverageScore(quizAvg); overview.getBySkill().get("reading").setLevel(overview.getCurrentLevel());
        overview.getBySkill().put("listening", new SkillProgressDto()); overview.getBySkill().put("speaking", new SkillProgressDto());
        return overview;
    }
}
