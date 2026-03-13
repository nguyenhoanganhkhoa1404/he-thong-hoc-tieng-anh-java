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
    
    // Danh sách dùng chung để lưu trạng thái học tập (không bị reset khi lấy lại từ vựng)
    private final List<VocabularyItemDto> allVocab = new ArrayList<>();

    public VocabularyGrammarService() {
        // --- 1. ĐÁP ÁN BÀI KIỂM TRA ĐẦU VÀO (5 CÂU) ---
        correctAnswers.put("q1", "am");         // Level A1
        correctAnswers.put("q2", "does");       // Level A1
        correctAnswers.put("q3", "went");       // Level A2
        correctAnswers.put("q4", "has been");   // Level B1
        correctAnswers.put("q5", "would have"); // Level B1+

        // --- 2. KHỞI TẠO DỮ LIỆU TỪ VỰNG ---
        initVocabData();
    }

    private void initVocabData() {
        // TRAVEL (Du lịch)
        allVocab.add(new VocabularyItemDto("v1", "Map", "Bản đồ", "I need a map to find the way.", "/mæp/", "travel", "A1", false));
        allVocab.add(new VocabularyItemDto("v2", "Ticket", "Vé", "Don't forget your flight ticket.", "/ˈtɪk.ɪt/", "travel", "A1", false));
        
        allVocab.add(new VocabularyItemDto("v3", "Destination", "Điểm đến", "Paris is a popular destination.", "/ˌdes.tɪˈneɪ.ʃən/", "travel", "A2", false));
        allVocab.add(new VocabularyItemDto("v4", "Passport", "Hộ chiếu", "You must carry your passport.", "/ˈpɑːs.pɔːt/", "travel", "A2", false));
        
        allVocab.add(new VocabularyItemDto("v5", "Itinerary", "Lịch trình", "We have a busy itinerary for the trip.", "/aɪˈtɪn.ər.ər.i/", "travel", "B1", false));
        allVocab.add(new VocabularyItemDto("v6", "Baggage allowance", "Hành lý ký gửi", "What is the baggage allowance?", "/ˈbæɡ.ɪdʒ əˌlaʊ.əns/", "travel", "B1", false));

        // BUSINESS (Kinh doanh)
        allVocab.add(new VocabularyItemDto("v7", "Office", "Văn phòng", "I work in an office.", "/ˈɒf.ɪs/", "business", "A1", false));
        allVocab.add(new VocabularyItemDto("v8", "Boss", "Sếp", "My boss is very professional.", "/bɒs/", "business", "A1", false));
        
        allVocab.add(new VocabularyItemDto("v9", "Meeting", "Cuộc họp", "We have a meeting at 10 AM.", "/ˈmiː.tɪŋ/", "business", "A2", false));
        allVocab.add(new VocabularyItemDto("v10", "Company", "Công ty", "The company is expanding.", "/ˈkʌm.pə.ni/", "business", "A2", false));
        
        allVocab.add(new VocabularyItemDto("v11", "Negotiate", "Đàm phán", "We need to negotiate the contract.", "/nəˈɡəʊ.ʃi.eɪt/", "business", "B1", false));
        allVocab.add(new VocabularyItemDto("v12", "Quarterly", "Hàng quý", "The quarterly report is ready.", "/ˈkwɔː.təl.i/", "business", "B1", false));
    }

    // ======================================================
    // CHỨC NĂNG 4: PLACEMENT TEST (Nâng cấp lên 5 câu)
    // ======================================================
    public List<QuestionDto> getPlacementQuestions() {
        return Arrays.asList(
            new QuestionDto("q1", "I ___ a student.", Arrays.asList("am", "is", "are")),
            new QuestionDto("q2", "What ___ she do every morning?", Arrays.asList("do", "does", "did")),
            new QuestionDto("q3", "Yesterday, they ___ to the cinema.", Arrays.asList("go", "goes", "went")),
            new QuestionDto("q4", "She ___ studying English for 5 years.", Arrays.asList("is", "has been", "was")),
            new QuestionDto("q5", "If I had known, I ___ told you.", Arrays.asList("will", "would have", "should"))
        );
    }

    public PlacementTestResultDto gradePlacementTest(PlacementSubmissionDto submission) {
        int score = 0;
        int total = 5; 
        
        if (submission.getAnswers() != null) {
            for (Map.Entry<String, String> entry : submission.getAnswers().entrySet()) {
                String correct = correctAnswers.get(entry.getKey());
                if (correct != null && correct.equals(entry.getValue())) {
                    score++;
                }
            }
        }

        // Logic xếp loại dựa trên số câu đúng
        String level;
        if (score >= 4) level = "B1 (Intermediate)";
        else if (score >= 2) level = "A2 (Pre-Elementary)";
        else level = "A1 (Beginner)";

        return new PlacementTestResultDto(score, total, level);
    }

    // ======================================================
    // CHỨC NĂNG 5: HỌC TỪ VỰNG (Persistence Logic)
    // ======================================================
    public List<VocabularyItemDto> getVocabulary(String topic, String level) {
        // Lọc từ danh sách allVocab thay vì tạo mới để giữ trạng thái đã học
        return allVocab.stream()
                .filter(v -> v.getCategory().equalsIgnoreCase(topic) && v.getLevel().equalsIgnoreCase(level))
                .collect(Collectors.toList());
    }

    public boolean markAsLearned(String id) {
        for (VocabularyItemDto item : allVocab) {
            if (item.getId().equals(id)) {
                item.setLearned(true); // Cập nhật trạng thái trực tiếp trong list tổng
                System.out.println("Đã đánh dấu thuộc từ: " + item.getWord());
                return true;
            }
        }
        return false;
    }

    // ======================================================
    // CHỨC NĂNG 6: HỌC NGỮ PHÁP
    // ======================================================
    public List<GrammarLessonDto> getGrammarLessons(String level) {
        List<GrammarLessonDto> list = new ArrayList<>();
        if ("A1".equalsIgnoreCase(level)) {
            list.add(new GrammarLessonDto("g1", "Present Simple (Hiện tại đơn)", "Diễn tả thói quen hoặc sự thật hiển nhiên.", "I study IT every day."));
        } else if ("A2".equalsIgnoreCase(level)) {
            list.add(new GrammarLessonDto("g2", "Past Simple (Quá khứ đơn)", "Hành động đã kết thúc hoàn toàn trong quá khứ.", "I finished my project yesterday."));
        } else if ("B1".equalsIgnoreCase(level)) {
            list.add(new GrammarLessonDto("g3", "Present Perfect (Hiện tại hoàn thành)", "Hành động xảy ra trong quá khứ kéo dài đến hiện tại.", "I have learned Java for 3 years."));
        }
        return list;
    }
}