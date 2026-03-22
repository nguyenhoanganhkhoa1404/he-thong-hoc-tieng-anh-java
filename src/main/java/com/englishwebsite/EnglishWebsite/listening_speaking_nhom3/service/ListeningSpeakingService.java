package com.englishwebsite.EnglishWebsite.listening_speaking_nhom3.service;

import com.englishwebsite.EnglishWebsite.listening_speaking_nhom3.dto.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * Nhóm 3 – Nghe & Nói. Dữ liệu demo trong bộ nhớ.
 */
@Service
public class ListeningSpeakingService {

    private static final String DEMO_AUDIO =
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

    private final Map<String, ListeningLessonDto> lessons = new LinkedHashMap<>();
    private final Map<String, List<ListeningQuestionDto>> questionsByLesson = new HashMap<>();
    private final Map<String, List<SpeakingPromptDto>> promptsByLesson = new HashMap<>();
    private final Map<String, SpeakingPromptDto> promptsById = new HashMap<>();
    private final Map<String, SpeakingAttemptDto> attempts = new HashMap<>();
    private final Map<String, List<ListeningResultResponse>> listeningResultsByUser = new HashMap<>();

    private final AtomicLong questionIdGen = new AtomicLong(1);
    private final AtomicLong attemptIdGen = new AtomicLong(1);

    public ListeningSpeakingService() {
        seedLessonsAndQuestions();
        seedSpeakingPrompts();
    }

    private void seedLessonsAndQuestions() {
        ListeningLessonDto l1 = new ListeningLessonDto();
        l1.setId("L-L01");
        l1.setTitle("Daily routine");
        l1.setLevel("A2");
        l1.setDescription("Nghe đoạn ngắn về thói quen buổi sáng, trả lời câu hỏi.");
        l1.setAudioUrl(DEMO_AUDIO);
        l1.setTranscript(
                "Every morning I wake up at six thirty. I brush my teeth and have breakfast. "
                        + "Then I walk to school with my friend.");
        lessons.put(l1.getId(), l1);

        List<ListeningQuestionDto> q1 = new ArrayList<>();
        q1.add(mc(l1.getId(), 1, "What time does the speaker wake up?", "Six thirty", "Seven o'clock", "Six thirty", "Six fifteen", "Seven thirty"));
        q1.add(mc(l1.getId(), 2, "Who does the speaker walk to school with?", "A friend", "Alone", "A friend", "A teacher", "A brother"));
        ListeningQuestionDto fill = new ListeningQuestionDto();
        fill.setId("LQ-" + questionIdGen.getAndIncrement());
        fill.setLessonId(l1.getId());
        fill.setType("FILL_BLANK");
        fill.setQuestionText("After breakfast, the speaker goes to _____. (school / work / home)");
        fill.setCorrectAnswers(List.of("school"));
        fill.setOrder(3);
        q1.add(fill);
        questionsByLesson.put(l1.getId(), q1);

        ListeningLessonDto l2 = new ListeningLessonDto();
        l2.setId("L-L02");
        l2.setTitle("At the café");
        l2.setLevel("A2");
        l2.setDescription("Đặt đồ uống – nghe và chọn ý đúng.");
        l2.setAudioUrl(DEMO_AUDIO);
        l2.setTranscript("Customer: Can I have a cup of coffee, please? Server: Sure. Milk or sugar? Customer: Just milk, thanks.");
        lessons.put(l2.getId(), l2);
        List<ListeningQuestionDto> q2 = new ArrayList<>();
        q2.add(mc(l2.getId(), 1, "What does the customer order?", "Coffee", "Tea", "Coffee", "Juice", "Water"));
        q2.add(mc(l2.getId(), 2, "What does the customer want in the drink?", "Milk", "Sugar", "Milk", "Nothing", "Lemon"));
        questionsByLesson.put(l2.getId(), q2);
    }

    private ListeningQuestionDto mc(String lessonId, int order, String text, String correct, String o1, String o2, String o3, String o4) {
        ListeningQuestionDto q = new ListeningQuestionDto();
        q.setId("LQ-" + questionIdGen.getAndIncrement());
        q.setLessonId(lessonId);
        q.setType("MULTIPLE_CHOICE");
        q.setQuestionText(text);
        q.setOptions(Arrays.asList(o1, o2, o3, o4));
        q.setCorrectAnswer(correct);
        q.setOrder(order);
        return q;
    }

    private void seedSpeakingPrompts() {
        SpeakingPromptDto p1 = new SpeakingPromptDto();
        p1.setId("SP-1");
        p1.setLessonId("S-L01");
        p1.setTitle("Giới thiệu bản thân");
        p1.setPromptText("Hãy nói về bản thân bạn trong 30–60 giây: tên, tuổi, sở thích.");
        p1.setSampleAnswerHint("My name is ... I am ... years old. I like ...");

        SpeakingPromptDto p2 = new SpeakingPromptDto();
        p2.setId("SP-2");
        p2.setLessonId("S-L01");
        p2.setTitle("Mô tả ngày của bạn");
        p2.setPromptText("Kể ngắn gọn một ngày điển hình của bạn (buổi sáng, học tập, buổi tối).");
        p2.setSampleAnswerHint("In the morning I ... Then I ... In the evening I ...");

        promptsByLesson.put("S-L01", new ArrayList<>(List.of(p1, p2)));
        promptsById.put(p1.getId(), p1);
        promptsById.put(p2.getId(), p2);
    }

    public List<ListeningLessonDto> listListeningLessons() {
        return new ArrayList<>(lessons.values());
    }

    public Optional<ListeningLessonDto> getListeningLesson(String lessonId) {
        return Optional.ofNullable(lessons.get(lessonId));
    }

    public List<ListeningQuestionDto> getListeningQuestions(String lessonId) {
        List<ListeningQuestionDto> list = questionsByLesson.get(lessonId);
        return list != null ? new ArrayList<>(list) : Collections.emptyList();
    }

    public ListeningResultResponse submitListening(ListeningSubmitRequest request) {
        String userId = request.getUserId() != null ? request.getUserId() : "user-demo";
        String lessonId = request.getLessonId();
        List<ListeningQuestionDto> questions = getListeningQuestions(lessonId);
        Map<String, String> answers = request.getAnswers() != null ? request.getAnswers() : new HashMap<>();
        int score = 0;
        for (ListeningQuestionDto q : questions) {
            String userAnswer = answers.get(q.getId());
            if (userAnswer == null) continue;
            if ("MULTIPLE_CHOICE".equals(q.getType())
                    && userAnswer.trim().equalsIgnoreCase(q.getCorrectAnswer() != null ? q.getCorrectAnswer().trim() : ""))
                score++;
            else if (q.getCorrectAnswers() != null
                    && q.getCorrectAnswers().stream().anyMatch(c -> c != null && c.trim().equalsIgnoreCase(userAnswer.trim())))
                score++;
        }
        ListeningResultResponse resp = new ListeningResultResponse();
        resp.setUserId(userId);
        resp.setLessonId(lessonId);
        resp.setScore(score);
        resp.setTotalQuestions(questions.size());
        resp.setPassed(questions.isEmpty() || (double) score / questions.size() >= 0.6);
        resp.setTimeSpentSeconds(request.getTimeSpentSeconds());
        listeningResultsByUser.computeIfAbsent(userId, k -> new ArrayList<>()).add(resp);
        return resp;
    }

    public List<ListeningResultResponse> getListeningResultsByUser(String userId) {
        return new ArrayList<>(listeningResultsByUser.getOrDefault(userId, Collections.emptyList()));
    }

    public List<SpeakingPromptDto> getSpeakingPrompts(String lessonId) {
        return new ArrayList<>(promptsByLesson.getOrDefault(lessonId, Collections.emptyList()));
    }

    public Optional<SpeakingPromptDto> findPromptById(String promptId) {
        return Optional.ofNullable(promptsById.get(promptId));
    }

    public SpeakingAttemptDto submitSpeaking(SpeakingSubmitRequest request) {
        String userId = request.getUserId() != null ? request.getUserId() : "user-demo";
        SpeakingPromptDto prompt = promptsById.get(request.getPromptId());
        String lessonId = prompt != null ? prompt.getLessonId() : null;
        String transcript = request.getTranscript() != null ? request.getTranscript() : "";
        int score = scoreSpeaking(transcript, prompt != null ? prompt.getSampleAnswerHint() : "");
        String feedback = feedbackSpeaking(transcript, score);

        SpeakingAttemptDto dto = new SpeakingAttemptDto();
        dto.setId("SA-" + attemptIdGen.getAndIncrement());
        dto.setUserId(userId);
        dto.setPromptId(request.getPromptId());
        dto.setLessonId(lessonId);
        dto.setTranscript(transcript);
        dto.setScore(score);
        dto.setFeedback(feedback);
        dto.setCreatedAt(LocalDateTime.now());
        attempts.put(dto.getId(), dto);
        return dto;
    }

    private static int scoreSpeaking(String transcript, String hint) {
        if (transcript == null || transcript.trim().isEmpty()) return 0;
        int words = transcript.trim().split("\\s+").length;
        int base = Math.min(10, 3 + words / 4);
        if (hint != null && !hint.isEmpty()) {
            Set<String> hintWords = tokenize(hint);
            Set<String> userWords = tokenize(transcript);
            long overlap = hintWords.stream().filter(userWords::contains).count();
            base = Math.min(10, base + (int) Math.min(3, overlap));
        }
        return base;
    }

    private static Set<String> tokenize(String s) {
        return Arrays.stream(s.toLowerCase(Locale.ROOT).split("\\W+"))
                .filter(w -> w.length() > 2)
                .collect(Collectors.toSet());
    }

    private static String feedbackSpeaking(String transcript, int score) {
        if (transcript == null || transcript.trim().isEmpty())
            return "Hãy ghi hoặc nói vài câu theo đề bài.";
        if (score < 4) return "Thử trả lời dài hơn, dùng thêm chi tiết (thời gian, địa điểm, cảm xúc).";
        if (score < 7) return "Ổn. Kiểm tra ngữ pháp và cố gắng nối câu bằng then, because, so.";
        return "Tốt. Tiếp tục luyện phát âm và nói to hơn.";
    }

    public List<SpeakingAttemptDto> getSpeakingAttemptsByUser(String userId) {
        return attempts.values().stream()
                .filter(a -> userId != null && userId.equals(a.getUserId()))
                .sorted(Comparator.comparing(SpeakingAttemptDto::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());
    }

    public Optional<SpeakingAttemptDto> getSpeakingAttemptById(String id) {
        return Optional.ofNullable(attempts.get(id));
    }
}
