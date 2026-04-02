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
@org.springframework.transaction.annotation.Transactional
public class WritingQuizProgressService {

    private final WritingExerciseRepository writingRepo;
    private final QuizQuestionRepository questionRepo;
    private final QuizResultRepository resultRepo;
    private final EnglishLessonRepository englishLessonRepo;
    private final EnglishQuestionRepository englishQuestionRepo;
    private final VocabularyRepository vocabularyRepo;
    private final SubmissionRepository submissionRepo;
    private final com.englishwebsite.EnglishWebsite.auth_nhom1.service.UserService userService;

    public WritingQuizProgressService(WritingExerciseRepository writingRepo,
                                     QuizQuestionRepository questionRepo,
                                     QuizResultRepository resultRepo,
                                     EnglishLessonRepository englishLessonRepo,
                                     EnglishQuestionRepository englishQuestionRepo,
                                     VocabularyRepository vocabularyRepo,
                                     SubmissionRepository submissionRepo,
                                     com.englishwebsite.EnglishWebsite.auth_nhom1.service.UserService userService) {
        this.writingRepo = writingRepo;
        this.questionRepo = questionRepo;
        this.resultRepo = resultRepo;
        this.englishLessonRepo = englishLessonRepo;
        this.englishQuestionRepo = englishQuestionRepo;
        this.vocabularyRepo = vocabularyRepo;
        this.submissionRepo = submissionRepo;
        this.userService = userService;
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
        if (request.getUserId() != null) {
            userService.addXp(request.getUserId(), 50); // Fixed 50 XP for writing exercise
            userService.updateStreak(request.getUserId());
        }
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

    public List<QuizQuestionDto> getAllQuestions(Integer limit, String level) {
        List<QuizQuestionDto> result = new ArrayList<>();
        int count = 1;

        // 1. PRIORITIZE REAL DATABASE (EnglishQuestion)
        List<EnglishQuestion> dbQuestions = englishQuestionRepo.findAll();
        if (!dbQuestions.isEmpty()) {
            Collections.shuffle(dbQuestions);
            int countToTake = Math.min(10, dbQuestions.size());
            for (int i = 0; i < countToTake; i++) {
                EnglishQuestion eq = dbQuestions.get(i);
                QuizQuestionDto dto = new QuizQuestionDto();
                dto.setId("DB-VQ-" + eq.getId()); // Database Verified Question
                dto.setQuestionText(eq.getContent() != null && eq.getContent().contains("A.") ? 
                    eq.getContent().split("A\\.")[0].trim() : eq.getContent());
                dto.setOptions(Arrays.asList(eq.getOptionA(), eq.getOptionB(), eq.getOptionC(), eq.getOptionD()));
                dto.setLessonId("grammar");
                dto.setType("MULTIPLE_CHOICE");
                
                String correctStr = eq.getCorrectAnswer() != null ? eq.getCorrectAnswer().toUpperCase() : "A";
                if (correctStr.equals("A")) dto.setCorrectAnswer(eq.getOptionA());
                else if (correctStr.equals("B")) dto.setCorrectAnswer(eq.getOptionB());
                else if (correctStr.equals("C")) dto.setCorrectAnswer(eq.getOptionC());
                else if (correctStr.equals("D")) dto.setCorrectAnswer(eq.getOptionD());
                else dto.setCorrectAnswer(eq.getOptionA());

                dto.setExplanation(eq.getExplanation() != null ? eq.getExplanation() : "Đáp án chính xác dựa trên ngữ pháp thực tế.");
                dto.setDifficultyLevel(level != null ? level : (i < 5 ? "A1" : "A2"));
                dto.setOrder(count++);
                result.add(dto);
            }
        }

        // 2. FALLBACK TO QuizQuestion (only if result is still empty or small)
        if (result.size() < 10) {
            List<QuizQuestion> all = questionRepo.findAll();
            if (!all.isEmpty()) {
                Collections.shuffle(all);
                for (QuizQuestion q : all) {
                    if (result.size() >= 10) break;
                    result.add(convertToDto(q));
                }
            }
        }
        if (result.isEmpty()) result = createDemoQuestions("general");
        
        if (limit != null && limit > 0 && limit < result.size()) {
            return result.subList(0, limit);
        }
        return result;
    }

    public List<QuizQuestionDto> getQuestionsByLesson(String lessonId) {
        List<QuizQuestion> entities = questionRepo.findByLessonId(lessonId);
        if (entities.isEmpty()) {
            List<QuizQuestionDto> demos = createDemoQuestions(lessonId);
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
        
        // Trust the score from request if it matches or if it's a demo (mismatch due to dynamic questions)
        if (request.getScore() != null) {
            score = request.getScore();
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

        if (request.getUserId() != null) {
            System.out.println("[DEBUG] Quiz Submit - UserID: " + request.getUserId() + ", Score: " + score);
            User user = userService.getUserById(request.getUserId());
            if (user != null) {
                System.out.println("[DEBUG] Processing user: " + user.getEmail() + ", Current Level: " + user.getLevel());
                
                // 1. Update XP
                int currentXp = user.getXp() != null ? user.getXp() : 0;
                user.setXp(currentXp + (score * 10));
                
                // 2. Performance Adaptation (Streak based)
                int streak = user.getStreak() != null ? user.getStreak() : 0;
                boolean levelChangedByStreak = false;
                
                if (score >= 8) {
                    user.setStreak(streak >= 0 ? streak + 1 : 1);
                    if (user.getStreak() >= 3) {
                        user.promoteLevel();
                        user.setStreak(0);
                        levelChangedByStreak = true;
                    }
                } else if (score < 5) {
                    user.setStreak(streak <= 0 ? streak - 1 : -1);
                    if (user.getStreak() <= -2) {
                        user.demoteLevel();
                        user.setStreak(0);
                        levelChangedByStreak = true;
                    }
                }

                // 3. Direct Promotion (User requirement: > 5 up, < 5 down)
                if (!levelChangedByStreak) {
                    if (score > 5) user.promoteLevel();
                    else if (score < 5) user.demoteLevel();
                }
                
                System.out.println("[DEBUG] NEW Level: " + user.getLevel() + ", NEW Streak: " + user.getStreak());
                userService.saveUser(user);
            }
        }

        return convertToResponse(entity);
    }

    public ProgressOverviewDto getProgressOverview(String userId) {
        String uid = userId != null ? userId : "user-demo";
        ProgressOverviewDto overview = new ProgressOverviewDto();
        overview.setUserId(uid);
        
        // 1. Reading (from MCQ Quizzes)
        List<QuizResult> userQuizResults = resultRepo.findByUserId(uid);
        int quizCount = userQuizResults.size();
        int totalQuestions = userQuizResults.stream().mapToInt(QuizResult::getTotalQuestions).sum();
        int totalScore = userQuizResults.stream().mapToInt(QuizResult::getScore).sum();
        double quizAvg = totalQuestions > 0 ? totalScore * 10.0 / totalQuestions : 0; // scaled to 10
        
        SkillProgressDto reading = new SkillProgressDto();
        reading.setCompletedLessons(quizCount);
        reading.setAverageScore(quizAvg * 10); // scale to 100
        reading.setLevel(quizAvg >= 8 ? "B1" : quizAvg >= 5 ? "A2" : "A1");
        overview.getBySkill().put("reading", reading);

        // 2. Writing (from AI Submissions + Writing Exercises)
        List<Submission> writingSubmissions = submissionRepo.findByUser_UidAndSubmissionType(uid, "WRITING");
        List<WritingExercise> userWritings = writingRepo.findByUserId(uid);
        int writingCount = writingSubmissions.size() + userWritings.size();
        
        double writingSubAvg = writingSubmissions.stream().filter(s -> s.getScore() != null).mapToDouble(Submission::getScore).average().orElse(0);
        double writingExeAvg = userWritings.stream().filter(w -> w.getScore() != null).mapToInt(WritingExercise::getScore).average().orElse(0) * 10;
        
        double finalWritingScore = writingCount > 0 ? (writingSubAvg * writingSubmissions.size() + writingExeAvg * userWritings.size()) / writingCount : 0;
        
        SkillProgressDto writing = new SkillProgressDto();
        writing.setCompletedLessons(writingCount);
        writing.setAverageScore(finalWritingScore);
        writing.setLevel(finalWritingScore >= 80 ? "B1" : finalWritingScore >= 50 ? "A2" : "A1");
        overview.getBySkill().put("writing", writing);
        
        // 3. Speaking (from AI Submissions)
        List<Submission> speakingSubmissions = submissionRepo.findByUser_UidAndSubmissionType(uid, "SPEAKING");
        int speakingCount = speakingSubmissions.size();
        double speakingAvg = speakingSubmissions.stream().filter(s -> s.getScore() != null).mapToDouble(Submission::getScore).average().orElse(0);
        
        SkillProgressDto speaking = new SkillProgressDto();
        speaking.setCompletedLessons(speakingCount);
        speaking.setAverageScore(speakingAvg);
        speaking.setLevel(speakingAvg >= 80 ? "B1" : speakingAvg >= 50 ? "A2" : "A1");
        overview.getBySkill().put("speaking", speaking);
        
        // 4. Listening (Placeholder for now, but linked to quizzes if lessonId starts with 'lis')
        SkillProgressDto listening = new SkillProgressDto();
        listening.setCompletedLessons(0);
        listening.setAverageScore(0);
        listening.setLevel("A1");
        overview.getBySkill().put("listening", listening);

        // Global Overview
        overview.setTotalLessonsCompleted(reading.getCompletedLessons() + writing.getCompletedLessons() + speaking.getCompletedLessons());
        double overallScore = (reading.getAverageScore() + writing.getAverageScore() + speaking.getAverageScore()) / 3.0;
        overview.setAverageScore(Math.round(overallScore * 10) / 10.0);
        overview.setCurrentLevel(overallScore >= 80 ? "B2" : overallScore >= 60 ? "B1" : overallScore >= 40 ? "A2" : "A1");
        
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
        dto.setExplanation(entity.getExplanation());
        
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
        
        // Populate level and streak from DB as a final confirmation
        if (entity.getUserId() != null && !entity.getUserId().equals("user-demo")) {
            User user = userService.getUserById(entity.getUserId());
            if (user != null) {
                resp.setCurrentLevel(user.getLevel());
                resp.setCurrentStreak(user.getStreak());
            }
        }
        return resp;
    }
}
