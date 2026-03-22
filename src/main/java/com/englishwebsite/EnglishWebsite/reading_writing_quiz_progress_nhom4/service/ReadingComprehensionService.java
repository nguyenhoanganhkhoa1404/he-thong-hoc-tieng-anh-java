package com.englishwebsite.EnglishWebsite.reading_writing_quiz_progress_nhom4.service;

import com.englishwebsite.EnglishWebsite.reading_writing_quiz_progress_nhom4.dto.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Đọc hiểu – đoạn văn + câu hỏi trắc nghiệm (demo trong bộ nhớ).
 */
@Service
public class ReadingComprehensionService {

    private final Map<String, ReadingPassageDto> passages = new LinkedHashMap<>();
    private final Map<String, List<ReadingQuestionDto>> questionsByPassage = new HashMap<>();
    private final Map<String, List<ReadingResultResponse>> resultsByUser = new HashMap<>();
    private final AtomicLong questionIdGen = new AtomicLong(1);

    public ReadingComprehensionService() {
        seed();
    }

    private void seed() {
        ReadingPassageDto p1 = new ReadingPassageDto();
        p1.setId("R-P01");
        p1.setTitle("A letter to a friend");
        p1.setLevel("A2");
        p1.setBody(
                "Dear Mai,\n\n"
                        + "I hope you are well. Last weekend I visited Da Lat with my family. "
                        + "The weather was cool and we walked around Xuan Huong Lake. "
                        + "We also tried strawberry ice cream. I want to go back next year!\n\n"
                        + "Love,\nHoa");
        passages.put(p1.getId(), p1);

        List<ReadingQuestionDto> q1 = new ArrayList<>();
        q1.add(rq(p1.getId(), 1, "Who wrote the letter?", "Hoa", "Mai", "Hoa", "Her teacher", "A tour guide"));
        q1.add(rq(p1.getId(), 2, "Where did they visit?", "Da Lat", "Ha Noi", "Da Lat", "Nha Trang", "Hue"));
        q1.add(rq(p1.getId(), 3, "What did they eat or try?", "Strawberry ice cream", "Coffee", "Strawberry ice cream", "Bread", "Rice"));
        questionsByPassage.put(p1.getId(), q1);

        ReadingPassageDto p2 = new ReadingPassageDto();
        p2.setId("R-P02");
        p2.setTitle("Saving energy at home");
        p2.setLevel("B1");
        p2.setBody(
                "Small changes can reduce your electricity bill. Turn off lights when you leave a room. "
                        + "Use LED bulbs instead of old ones. Unplug chargers when they are not in use. "
                        + "These habits also help protect the environment.");
        passages.put(p2.getId(), p2);
        List<ReadingQuestionDto> q2 = new ArrayList<>();
        q2.add(rq(p2.getId(), 1, "What is one tip in the text?", "Turn off lights", "Buy a new TV", "Turn off lights", "Open all windows", "Use more heaters"));
        q2.add(rq(p2.getId(), 2, "LED bulbs are suggested because they are more ____ than old bulbs.", "efficient", "expensive", "efficient", "colorful", "heavy"));
        questionsByPassage.put(p2.getId(), q2);
    }

    private ReadingQuestionDto rq(String passageId, int order, String text, String correct, String o1, String o2, String o3, String o4) {
        ReadingQuestionDto q = new ReadingQuestionDto();
        q.setId("RQ-" + questionIdGen.getAndIncrement());
        q.setPassageId(passageId);
        q.setType("MULTIPLE_CHOICE");
        q.setQuestionText(text);
        q.setOptions(Arrays.asList(o1, o2, o3, o4));
        q.setCorrectAnswer(correct);
        q.setOrder(order);
        return q;
    }

    public List<ReadingPassageDto> listPassages() {
        return new ArrayList<>(passages.values());
    }

    public Optional<ReadingPassageDto> getPassage(String passageId) {
        return Optional.ofNullable(passages.get(passageId));
    }

    public List<ReadingQuestionDto> getQuestions(String passageId) {
        List<ReadingQuestionDto> list = questionsByPassage.get(passageId);
        return list != null ? new ArrayList<>(list) : Collections.emptyList();
    }

    public ReadingResultResponse submit(ReadingSubmitRequest request) {
        String userId = request.getUserId() != null ? request.getUserId() : "user-demo";
        String passageId = request.getPassageId();
        List<ReadingQuestionDto> questions = getQuestions(passageId);
        Map<String, String> answers = request.getAnswers() != null ? request.getAnswers() : new HashMap<>();
        int score = 0;
        for (ReadingQuestionDto q : questions) {
            String userAnswer = answers.get(q.getId());
            if (userAnswer == null) continue;
            if (userAnswer.trim().equalsIgnoreCase(q.getCorrectAnswer() != null ? q.getCorrectAnswer().trim() : ""))
                score++;
        }
        ReadingResultResponse resp = new ReadingResultResponse();
        resp.setUserId(userId);
        resp.setPassageId(passageId);
        resp.setScore(score);
        resp.setTotalQuestions(questions.size());
        resp.setPassed(questions.isEmpty() || (double) score / questions.size() >= 0.6);
        resp.setTimeSpentSeconds(request.getTimeSpentSeconds());
        resultsByUser.computeIfAbsent(userId, k -> new ArrayList<>()).add(resp);
        return resp;
    }

    public List<ReadingResultResponse> getResultsByUser(String userId) {
        return new ArrayList<>(resultsByUser.getOrDefault(userId, Collections.emptyList()));
    }
}
