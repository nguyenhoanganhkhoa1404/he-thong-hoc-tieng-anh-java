package com.englishwebsite.EnglishWebsite.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.poi.xwpf.usermodel.UnderlinePatterns;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class FileParsingService {

    public Map<String, Object> parseFile(MultipartFile file) throws IOException {
        String filename = file.getOriginalFilename();
        String content = "";

        if (filename != null && filename.endsWith(".pdf")) {
            content = extractTextFromPdf(file.getInputStream());
        } else if (filename != null && (filename.endsWith(".docx") || filename.endsWith(".doc"))) {
            content = extractTextFromWord(file.getInputStream());
        } else {
            throw new IllegalArgumentException("Unsupported file type: " + filename);
        }

        return processContent(content);
    }

    private String extractTextFromPdf(InputStream is) throws IOException {
        try (PDDocument document = PDDocument.load(is)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String extractTextFromWord(InputStream is) throws IOException {
        try (XWPFDocument document = new XWPFDocument(is)) {
            StringBuilder sb = new StringBuilder();
            for (XWPFParagraph p : document.getParagraphs()) {
                for (XWPFRun r : p.getRuns()) {
                    String text = r.getText(0);
                    if (text == null || text.trim().isEmpty()) continue;
                    
                    boolean isBold = r.isBold();
                    boolean isUnderlined = r.getUnderline() != UnderlinePatterns.NONE;
                    
                    if (isBold || isUnderlined) {
                        sb.append("[[CORRECT]]").append(text).append("[[/CORRECT]]");
                    } else {
                        sb.append(text);
                    }
                }
                sb.append("\n");
            }
            return sb.toString();
        }
    }

    private String stripMarkers(String text) {
        if (text == null) return "";
        return text.replaceAll("\\[\\[/?CORRECT\\]\\]", "").trim();
    }

    private Map<String, Object> processContent(String text) {
        List<Map<String, Object>> questions = new ArrayList<>();
        StringBuilder passageBuilder = new StringBuilder();

        // 1. Detect Answer Key globally
        Map<Integer, String> answerKey = new HashMap<>();
        // Look for common answer key formats: "1.A 2.B", "1-A 2-B", "Câu 1. A", etc.
        Pattern answerPattern = Pattern.compile("(?:Câu|Question|\\b)?\\s*(\\d+)\\s*[.:\\-]\\s*([A-D])", Pattern.CASE_INSENSITIVE);
        
        // Search in the whole text but prioritize the end
        Matcher am = answerPattern.matcher(text);
        while (am.find()) {
            answerKey.put(Integer.parseInt(am.group(1)), am.group(2).toUpperCase());
        }

        // 2. Universal Question Splitter
        // Matches "Question 1.", "Câu 1:", "1.", "1)" at the start of a line (or near it)
        String[] questionParts = text.split("(?i)(?:^|\\n)\\s*(?:Question|Câu)?\\s*\\d+[.:\\)]\\s*");
        
        // The first part is the header/passage
        if (questionParts.length > 0) {
            passageBuilder.append(stripMarkers(questionParts[0].trim()));
        }

        // Robust Option Pattern: Look for A, B, C, D followed by . or ) 
        // We handle markers around the letter or inside the content
        Pattern optionPattern = Pattern.compile("(?i)(?:\\[\\[CORRECT\\]\\])?\\s*([A-D])[.\\)]\\s*((?:(?!\\[\\[CORRECT\\]\\][A-D][.\\)]|\\s[A-D][.\\)]).)+)", Pattern.DOTALL);

        for (int i = 1; i < questionParts.length; i++) {
            String part = questionParts[i].trim();
            if (part.isEmpty()) continue;

            Map<String, Object> q = new HashMap<>();
            
            // Try to find options
            Matcher om = optionPattern.matcher(part);
            List<String> options = new ArrayList<>();
            int firstOptionIndex = -1;
            String detectedCorrectFromStyle = null;
            
            while (om.find()) {
                if (firstOptionIndex == -1) firstOptionIndex = om.start();
                String letter = om.group(1).toUpperCase();
                String fullMatch = om.group(0);
                String content = om.group(2);

                if (fullMatch.contains("[[CORRECT]]")) {
                    detectedCorrectFromStyle = letter;
                }
                
                options.add(stripMarkers(content));
            }

            String questionText = (firstOptionIndex != -1) ? part.substring(0, firstOptionIndex).trim() : part;
            questionText = stripMarkers(questionText);
            
            // Cleanup: remove any remaining "Question X" or answer key bits from text
            questionText = questionText.replaceAll("(?i)(?:Question|Câu)?\\s*\\d+\\s*[.:\\-]\\s*[A-D]", "").trim();

            if (questionText.isEmpty()) questionText = "Question " + i;

            q.put("text", questionText);
            q.put("type", "MULTIPLE_CHOICE");
            
            String correctAnswer = detectedCorrectFromStyle;
            if (correctAnswer == null) {
                // Heuristic: If we are at index i, check answer key for index i
                correctAnswer = answerKey.getOrDefault(i, "A");
            }
            q.put("correct", correctAnswer);

            if (options.isEmpty()) {
                q.put("options", "Option A,Option B,Option C,Option D");
            } else {
                // Ensure we have exactly 4 options if possible, or join what we have
                q.put("options", String.join(",", options));
            }
            
            questions.add(q);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("passage", passageBuilder.toString());
        result.put("questions", questions);
        return result;
    }
}
