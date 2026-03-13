package com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.service;

import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.GrammarLessonDto;
import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.PlacementSubmissionDto;
import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.PlacementTestResultDto;
import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.QuestionDto;
import com.englishwebsite.EnglishWebsite.vocabulary_grammar_nhom2.dto.VocabularyItemDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VocabularyGrammarService {

    private final Map<String, String> correctAnswers = new HashMap<>();
    
    // Biến này sẽ lưu trữ toàn bộ từ vựng trong suốt quá trình server chạy
    private final List<VocabularyItemDto> allVocab = new ArrayList<>();

    public VocabularyGrammarService() {
        // Đáp án bài test
        correctAnswers.put("q1", "am");
        correctAnswers.put("q2", "does");
        correctAnswers.put("q3", "went");

        // Khởi tạo dữ liệu mẫu (chỉ chạy 1 lần khi start app)
        initData();
    }

    private void initData() {
        // --- TRAVEL ---
        allVocab.add(new VocabularyItemDto("v1", "Map", "Bản đồ", "I need a map.", "/mæp/", "travel", "A1", false));
        allVocab.add(new VocabularyItemDto("v2", "Ticket", "Vé", "Buy a train ticket.", "/ˈtɪk.ɪt/", "travel", "A1", false));
        
        allVocab.add(new VocabularyItemDto("v3", "Destination", "Điểm đến", "Paris is my destination.", "/ˌdes.tɪˈneɪ.ʃən/", "travel", "A2", false));
        allVocab.add(new VocabularyItemDto("v4", "Passport", "Hộ chiếu", "Don't forget your passport!", "/ˈpɑːs.pɔːt/", "travel", "A2", false));
        
        allVocab.add(new VocabularyItemDto("v5", "Itinerary", "Lịch trình", "Check the flight itinerary.", "/aɪˈtɪn.ər.ər.i/", "travel", "B1", false));
        allVocab.add(new VocabularyItemDto("v6", "Baggage allowance", "Hành lý ký gửi", "What is the baggage allowance?", "/ˈbæɡ.ɪdʒ əˌlaʊ.əns/", "travel", "B1", false));

        // --- BUSINESS ---
        allVocab.add(new VocabularyItemDto("v7", "Office", "Văn phòng", "I work in an office.", "/ˈɒf.ɪs/", "business", "A1", false));
        allVocab.add(new VocabularyItemDto("v8", "Boss", "Sếp", "My boss is nice.", "/bɒs/", "business", "A1", false));
        
        allVocab.add(new VocabularyItemDto("v9", "Meeting", "Cuộc họp", "We have a meeting now.", "/ˈmiː.tɪŋ/", "business", "A2", false));
        allVocab.add(new VocabularyItemDto("v10", "Company", "Công ty", "The company is big.", "/ˈkʌm.pə.ni/", "business", "A2", false));
        
        allVocab.add(new VocabularyItemDto("v11", "Negotiate", "Đàm phán", "We need to negotiate the contract.", "/nəˈɡəʊ.ʃi.eɪt/", "business", "B1", false));
        allVocab.add(new VocabularyItemDto("v12", "Quarterly", "Hàng quý", "Quarterly report is ready.", "/ˈkwɔː.təl.i/", "business", "B1", false));
    }

    // =========================================
    // CHỨC NĂNG 4: PLACEMENT TEST
    // =========================================
    public List<QuestionDto> getPlacementQuestions() {
        return Arrays.asList(
            new QuestionDto("q1", "I ___ a student.", Arrays.asList("am", "is", "are")),
            new QuestionDto("q2", "What ___ she do?", Arrays.asList("do", "does", "did")),
            new QuestionDto("q3", "Yesterday, I ___ to the park.", Arrays.asList("go", "goes", "went"))
        );
    }

    public PlacementTestResultDto gradePlacementTest(PlacementSubmissionDto submission) {
        int score = 0;
        if (submission.getAnswers() != null) {
            for (Map.Entry<String, String> entry : submission.getAnswers().entrySet()) {
                if (correctAnswers.get(entry.getKey()).equals(entry.getValue())) score++;
            }
        }
        String level = (score == 3) ? "B1" : (score == 2) ? "A2" : "A1";
        return new PlacementTestResultDto(score, 3, level);
    }

    // =========================================
    // CHỨC NĂNG 5: HỌC TỪ VỰNG (Đã fix lỗi reset)
    // =========================================
    public List<VocabularyItemDto> getVocabulary(String topic, String level) {
        // Lọc từ danh sách dùng chung allVocab
        return allVocab.stream()
                .filter(v -> v.getCategory().equalsIgnoreCase(topic) && v.getLevel().equalsIgnoreCase(level))
                .collect(Collectors.toList());
    }

    public boolean markAsLearned(String id) {
        // Tìm và cập nhật trạng thái trực tiếp trong list dùng chung
        for (VocabularyItemDto item : allVocab) {
            if (item.getId().equals(id)) {
                item.setLearned(true);
                System.out.println("Backend: Đã lưu trạng thái ĐÃ HỌC cho từ: " + item.getWord());
                return true;
            }
        }
        return false;
    }

    // =========================================
    // CHỨC NĂNG 6: HỌC NGỮ PHÁP
    // =========================================
    public List<GrammarLessonDto> getGrammarLessons(String level) {
        List<GrammarLessonDto> list = new ArrayList<>();
        if ("A1".equalsIgnoreCase(level)) {
            list.add(new GrammarLessonDto("g1", "Present Simple (Hiện tại đơn)", "Diễn tả thói quen.", "I drink water."));
        } else if ("A2".equalsIgnoreCase(level)) {
            list.add(new GrammarLessonDto("g2", "Past Simple (Quá khứ đơn)", "Hành động đã kết thúc.", "I drank water yesterday."));
        } else if ("B1".equalsIgnoreCase(level)) {
            list.add(new GrammarLessonDto("g3", "Present Perfect (Hiện tại hoàn thành)", "Kinh nghiệm đã trải qua.", "I have drunk water today."));
        }
        return list;
    }
}