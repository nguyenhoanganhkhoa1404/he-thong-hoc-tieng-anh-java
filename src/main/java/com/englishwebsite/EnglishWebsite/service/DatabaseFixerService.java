package com.englishwebsite.EnglishWebsite.service;

import com.englishwebsite.EnglishWebsite.model.EnglishQuestion;
import com.englishwebsite.EnglishWebsite.repository.EnglishQuestionRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class DatabaseFixerService {

    private final EnglishQuestionRepository repository;

    public DatabaseFixerService(EnglishQuestionRepository repository) {
        this.repository = repository;
    }

    @PostConstruct
    public void fixCorruptedStrings() {
        List<EnglishQuestion> questions = repository.findAll();
        boolean changed = false;

        Map<String, String> replacements = new java.util.LinkedHashMap<>();
        // Priority sequences
        replacements.put("Mß╗çnh ─æß╗ü", "Mệnh đề");
        replacements.put("ngh─®a mß║Àc d├╣", "nghĩa mặc dù");
        
        // Character-level mojibake
        replacements.put("─æ", "đ");
        replacements.put("├╣", "ù");
        replacements.put("ß║í", "ạ");
        replacements.put("ß╗½", "ừ");
        replacements.put("ß╗ç", "ệ");
        replacements.put("ã░", "ư");
        replacements.put("ß╗Ø", "ờ");
        replacements.put("├│", "ó");
        replacements.put("├▓", "ò");
        replacements.put("ß╗º", "ủ");
        replacements.put("ß╗»", "ữ");
        replacements.put("├á", "à");
        replacements.put("├í", "á");
        replacements.put("├ú", "ã");
        replacements.put("ß║ú", "ả");
        replacements.put("ß╗ï", "ị");
        replacements.put("ß╗ì", "ọ");
        replacements.put("├¬", "ê");
        replacements.put("├┤", "ô");
        replacements.put("├ó", "â");
        replacements.put("ß║º", "ầ");
        replacements.put("ß╗¢", "ờ"); // another variant for 'ờ'
        replacements.put("ß║┐", "ế");
        replacements.put("├¿", "è");
        replacements.put("ß╗ì", "ọ");
        replacements.put("ß╗ì", "ọ");
        replacements.put("├í", "á");
        replacements.put("├á", "à");
        replacements.put("ß║ú", "ả");
        replacements.put("├ú", "ã");
        replacements.put("ß║í", "ạ");
        replacements.put("├¬", "ê");
        replacements.put("ß╗ü", "ề");
        replacements.put("ß║┐", "ế");
        replacements.put("ß╗â", "ể");
        replacements.put("ß╗à", "ễ");
        replacements.put("ß╗ç", "ệ");
        replacements.put("├┤", "ô");
        replacements.put("ß╗ô", "ồ");
        replacements.put("ß╗", "ố");
        replacements.put("ß╗ù", "ổ");
        replacements.put("ß╗Ö", "ỗ");
        replacements.put("ß╗Ö", "ộ");
        replacements.put("├║", "ú");
        replacements.put("├╣", "ù");
        replacements.put("ß╗º", "ủ");
        replacements.put("┼®", "ũ");
        replacements.put("ß╗Ñ", "ụ");
        replacements.put("ã░", "ư");
        replacements.put("ß╗½", "ừ");
        replacements.put("ß╗⌐", "ứ");
        replacements.put("ß╗¡", "ử");
        replacements.put("ß╗»", "ữ");
        replacements.put("ß╗▒", "ự");
        replacements.put("├¡", "í");
        replacements.put("├¼", "ì");
        replacements.put("ß╗ë", "ỉ");
        replacements.put("─®", "ĩ");
        replacements.put("ß╗ï", "ị");
        replacements.put("├¢", "ý");
        replacements.put("ß╗│", "ỳ");
        replacements.put("ß╗À", "ỷ");
        replacements.put("ß╗╣", "ỹ");
        replacements.put("ß╗╗", "ỵ");
        replacements.put("─æ", "đ");
        
        for (EnglishQuestion q : questions) {
            boolean qChanged = false;
            String explanation = q.getExplanation();
            if (explanation != null) {
                for (Map.Entry<String, String> entry : replacements.entrySet()) {
                    if (explanation.contains(entry.getKey())) {
                        explanation = explanation.replace(entry.getKey(), entry.getValue());
                        qChanged = true;
                    }
                }
            }
            
            String content = q.getContent();
            if (content != null) {
                for (Map.Entry<String, String> entry : replacements.entrySet()) {
                    if (content.contains(entry.getKey())) {
                        content = content.replace(entry.getKey(), entry.getValue());
                        qChanged = true;
                    }
                }
            }

            if (qChanged) {
                q.setExplanation(explanation);
                q.setContent(content);
                repository.save(q);
                changed = true;
            }
        }

        if (changed) {
            System.out.println(">>> DatabaseFixerService: Fixed corrupted grammar strings in EnglishQuestions.");
        }
    }
}
