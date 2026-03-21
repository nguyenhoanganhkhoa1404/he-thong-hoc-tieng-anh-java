package com.englishwebsite.EnglishWebsite.reading_writing_quiz_progress_nhom4.service;

import com.englishwebsite.EnglishWebsite.reading_writing_quiz_progress_nhom4.dto.*;
import com.englishwebsite.EnglishWebsite.model.*;
import com.englishwebsite.EnglishWebsite.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service Nhóm 4 – Writing, Quiz & Progress.
 * Chức năng 10: Writing | 11: Quiz | 12: Progress. In-memory demo.
 */
@Service
public class WritingQuizProgressService {

    private final WritingExerciseRepository writingRepo;
    private final QuizQuestionRepository questionRepo;
    private final QuizResultRepository resultRepo;

    public WritingQuizProgressService(WritingExerciseRepository writingRepo,
                                     QuizQuestionRepository questionRepo,
                                     QuizResultRepository resultRepo) {
        this.writingRepo = writingRepo;
        this.questionRepo = questionRepo;
        this.resultRepo = resultRepo;
    }

    public WritingExerciseDto submitWriting(WritingSubmitRequest request) {
        String userId = request.getUserId() != null ? request.getUserId() : "user-demo";
        String id = "W-" + UUID.randomUUID().toString().substring(0, 8);
        
        WritingExercise entity = new WritingExercise();
        entity.setId(id);
        entity.setUserId(userId);
        entity.setLessonId(request.getLessonId());
        entity.setPrompt(request.getPrompt());
        entity.setContent(request.getContent());
        entity.setCreatedAt(LocalDateTime.now());
        entity.setFeedback(generateSimpleFeedback(request.getContent()));
        entity.setScore(estimateScore(request.getContent()));
        
        writingRepo.save(entity);
        return convertToDto(entity);
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
        return writingRepo.findByUserId(userId).stream()
                .map(this::convertToDto)
                .sorted(Comparator.comparing(WritingExerciseDto::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());
    }

    public Optional<WritingExerciseDto> getWritingById(String id) {
        return writingRepo.findById(id).map(this::convertToDto);
    }

    public List<QuizQuestionDto> getQuestionsByLesson(String lessonId) {
        List<QuizQuestion> entities = questionRepo.findByLessonId(lessonId);
        if (entities.isEmpty()) {
            List<QuizQuestionDto> demos = createDemoQuestions(lessonId);
            // In a real migration, we'd save these to the database if needed
            return demos;
        }
        return entities.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private List<QuizQuestionDto> createDemoQuestions(String lessonId) {
        List<QuizQuestionDto> list = new ArrayList<>();
        int count = 1;
        for (String[] row : new String[][]{
                {"She _____ to school every day.", "goes", "go", "goes", "going", "went"},
                {"Past tense of 'buy'?", "bought", "buyed", "bought", "buys", "buying"}
        }) {
            QuizQuestionDto q = new QuizQuestionDto();
            q.setId("Q-" + lessonId + "-" + (count++));
            q.setLessonId(lessonId);
            q.setType("MULTIPLE_CHOICE");
            q.setQuestionText(row[0]);
            q.setOptions(Arrays.asList(row[2], row[3], row[4], row[5]));
            q.setCorrectAnswer(row[1]);
            q.setOrder(list.size() + 1);
            list.add(q);
        }
        QuizQuestionDto q3 = new QuizQuestionDto();
        q3.setId("Q-" + lessonId + "-" + count);
        q3.setLessonId(lessonId);
        q3.setType("FILL_BLANK");
        q3.setQuestionText("I _____ (to be) a student. Fill: am / is / are");
        q3.setCorrectAnswers(Collections.singletonList("am"));
        q3.setOrder(list.size() + 1);
        list.add(q3);
        return list;
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
        
        QuizResult entity = new QuizResult();
        entity.setUserId(userId);
        entity.setLessonId(request.getLessonId());
        entity.setScore(score);
        entity.setTotalQuestions(questions.size());
        entity.setPassed(questions.isEmpty() || (double) score / questions.size() >= 0.6);
        entity.setTimeSpentSeconds((int) request.getTimeSpentSeconds());
        entity.setCreatedAt(LocalDateTime.now());
        
        resultRepo.save(entity);
        return convertToResponse(entity);
    }

    public ProgressOverviewDto getProgressOverview(String userId) {
        String uid = userId != null ? userId : "user-demo";
        ProgressOverviewDto overview = new ProgressOverviewDto();
        overview.setUserId(uid);
        
        List<WritingExercise> userWritings = writingRepo.findByUserId(uid);
        int writingCount = userWritings.size();
        double writingAvg = userWritings.stream().filter(w -> w.getScore() != null).mapToInt(WritingExercise::getScore).average().orElse(0);
        
        List<QuizResult> userQuizResults = resultRepo.findByUserId(uid);
        int quizCount = userQuizResults.size();
        int totalQuestions = userQuizResults.stream().mapToInt(QuizResult::getTotalQuestions).sum();
        int totalScore = userQuizResults.stream().mapToInt(QuizResult::getScore).sum();
        double quizAvg = totalQuestions > 0 ? totalScore * 10.0 / totalQuestions : 0;
        
        overview.setTotalLessonsCompleted(writingCount + quizCount);
        if (writingCount + quizCount > 0)
            overview.setAverageScore(Math.round((writingAvg * writingCount + quizAvg * quizCount) / (writingCount + quizCount) * 10) / 10.0);
        else overview.setAverageScore(0);
        
        overview.setCurrentLevel(overview.getAverageScore() >= 8 ? "B1" : overview.getAverageScore() >= 5 ? "A2" : "A1");
        overview.getBySkill().put("writing", new SkillProgressDto()); 
        overview.getBySkill().get("writing").setCompletedLessons(writingCount); 
        overview.getBySkill().get("writing").setAverageScore(writingAvg); 
        overview.getBySkill().get("writing").setLevel(overview.getCurrentLevel());
        
        overview.getBySkill().put("reading", new SkillProgressDto()); 
        overview.getBySkill().get("reading").setCompletedLessons(quizCount); 
        overview.getBySkill().get("reading").setAverageScore(quizAvg); 
        overview.getBySkill().get("reading").setLevel(overview.getCurrentLevel());
        
        overview.getBySkill().put("listening", new SkillProgressDto()); 
        overview.getBySkill().put("speaking", new SkillProgressDto());
        return overview;
    }

    private WritingExerciseDto convertToDto(WritingExercise entity) {
        WritingExerciseDto dto = new WritingExerciseDto();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUserId());
        dto.setLessonId(entity.getLessonId());
        dto.setPrompt(entity.getPrompt());
        dto.setContent(entity.getContent());
        dto.setFeedback(entity.getFeedback());
        dto.setScore(entity.getScore());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    private QuizQuestionDto convertToDto(QuizQuestion entity) {
        QuizQuestionDto dto = new QuizQuestionDto();
        dto.setId(entity.getId());
        dto.setLessonId(entity.getLessonId());
        dto.setType(entity.getType());
        dto.setQuestionText(entity.getQuestionText());
        dto.setCorrectAnswer(entity.getCorrectAnswer());
        dto.setOrder(entity.getOrder());
        
        if (entity.getOptionsJson() != null) {
            dto.setOptions(Arrays.asList(entity.getOptionsJson().split(",")));
        }
        if (entity.getCorrectAnswersJson() != null) {
            dto.setCorrectAnswers(Arrays.asList(entity.getCorrectAnswersJson().split(",")));
        }
        return dto;
    }

    private QuizResultResponse convertToResponse(QuizResult entity) {
        QuizResultResponse resp = new QuizResultResponse();
        resp.setUserId(entity.getUserId());
        resp.setLessonId(entity.getLessonId());
        resp.setScore(entity.getScore());
        resp.setTotalQuestions(entity.getTotalQuestions());
        resp.setPassed(entity.isPassed());
        resp.setTimeSpentSeconds(entity.getTimeSpentSeconds());
        return resp;
    }
}
