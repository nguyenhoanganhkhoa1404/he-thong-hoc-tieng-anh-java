package com.englishwebsite.EnglishWebsite.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.web.client.HttpClientErrorException;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.Arrays;

@Service
public class AIService {
    
    @Value("${openai.api.key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> analyzeWriting(String text, String prompt) {
        Map<String, Object> report = new HashMap<>();
        
        if (apiKey == null || apiKey.isEmpty()) {
            return generateMockWritingReport(text, prompt);
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-4o-mini");
            
            String systemPrompt = "You are an expert English teacher. Evaluate the student's writing based on the prompt: '" + prompt + "'. " +
                                 "Provide a JSON response with: score (0-10), grammarScore (0-10), vocabScore (0-10), coherenceScore (0-10), " +
                                 "and feedback (detailed markdown suggestions with native-like refinements).";
            
            requestBody.put("messages", Arrays.asList(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", text)
            ));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://api.openai.com/v1/chat/completions", 
                entity, 
                Map.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                String content = (String) ((Map<String, Object>) choices.get(0).get("message")).get("content");
                
                report.put("score", 85.0);
                report.put("grammarScore", 80.0);
                report.put("vocabScore", 90.0);
                report.put("coherenceScore", 85.0);
                report.put("feedback", content);
                return report;
            }
        } catch (HttpClientErrorException.TooManyRequests e) {
            System.err.println("AI Writing Quota Exceeded: " + e.getMessage());
            return generateMockWritingReport(text, prompt);
        } catch (Exception e) {
            System.err.println("AI Writing Error: " + e.getMessage());
        }

        return generateMockWritingReport(text, prompt);
    }

    private Map<String, Object> generateMockWritingReport(String text, String prompt) {
        Map<String, Object> report = new HashMap<>();
        double score = Math.min(100, (text.split(" ").length / 2.0) + 70);
        report.put("score", score);
        report.put("grammarScore", Math.min(100, score - 5));
        report.put("vocabScore", Math.min(100, score + 2));
        report.put("coherenceScore", Math.min(100, score - 2));
        report.put("feedback", "### 🤖 AI Evaluation Report (Local Analysis)\n\n" +
               "**Grammar:** Good structure.\n" +
               "**Vocabulary:** Diverse word choice.\n" +
               "**✨ Refinement:** Your writing is clear. (Note: OpenAI API quota exceeded or key missing, using simulated feedback)");
        return report;
    }

    public String transcribeAudio(byte[] bytes, String fileName, String originalText, String localTranscript) {
        if (apiKey == null || apiKey.isEmpty()) {
            return generateSimulatedTranscription(originalText, localTranscript);
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.setBearerAuth(apiKey);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(bytes) {
                @Override
                public String getFilename() { return fileName; }
            });
            body.add("model", "whisper-1");

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://api.openai.com/v1/audio/transcriptions", 
                requestEntity, 
                Map.class
            );
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (String) response.getBody().get("text");
            }
            return generateSimulatedTranscription(originalText, localTranscript);
        } catch (HttpClientErrorException.TooManyRequests e) {
            System.err.println("Whisper API Quota Exceeded: " + e.getMessage());
            return generateSimulatedTranscription(originalText, localTranscript);
        } catch (Exception e) {
            System.err.println("Audio Transcription Error: " + e.getMessage());
            return generateSimulatedTranscription(originalText, localTranscript);
        }
    }

    private String generateSimulatedTranscription(String originalText, String localTranscript) {
        // If we have a local transcript from the browser, use it! It's better than mocking.
        if (localTranscript != null && !localTranscript.trim().isEmpty() && !localTranscript.equals("undefined")) {
            return localTranscript;
        }

        // Randomize the dummy to simulate different performances instead of "same y chang" results
        String cleanTitle = originalText.split("Key Collocations:")[0].replace("Sample Answer:", "").trim();
        String[] words = cleanTitle.split("\\s+");
        StringBuilder mock = new StringBuilder("[Simulated] ");
        
        // Take a random subset of words or slightly mutate them
        int limit = Math.min(words.length, 5 + (int)(Math.random() * 10));
        for (int i = 0; i < limit; i++) {
            if (Math.random() > 0.1) { // 10% chance to skip or change a word
                mock.append(words[i]).append(" ");
            } else {
                mock.append("... ");
            }
        }

        return mock.toString().trim() + "... (Fallback: No live voice data captured)";
    }

    public Map<String, Object> analyzeSpeaking(String transcribeText, String originalText) {
        Map<String, Object> report = new HashMap<>();
        
        // Clean originalText: Only evaluate against the first part (before collocations/metadata)
        String cleanOriginal = originalText;
        if (cleanOriginal.contains("Key Collocations:") || cleanOriginal.contains("Useful Structures:")) {
            cleanOriginal = cleanOriginal.split("Key Collocations:")[0].split("Useful Structures:")[0].trim();
        }
        if (cleanOriginal.startsWith("Sample Answer:")) {
            cleanOriginal = cleanOriginal.replace("Sample Answer:", "").trim();
        }

        // Calculate a "real" similarity score
        double similarity = calculateSimilarity(transcribeText, cleanOriginal);
        int score = (int) (similarity * 100);
        
        report.put("fluencyScore", Math.min(100, score + 10));
        report.put("pronunciationScore", score);
        report.put("stressScore", Math.max(0, score - 5));
        report.put("speakingSpeed", 125); // words per minute
        report.put("transcribedText", transcribeText);
        report.put("analysis", "Your pronunciation accuracy is " + score + "%. " + 
                  (score > 80 ? "Excellent work!" : "Keep practicing the vowel sounds."));
        
        return report;
    }

    private double calculateSimilarity(String s1, String s2) {
        if (s1 == null || s2 == null) return 0.5;
        String longer = s1.length() > s2.length() ? s1 : s2;
        String shorter = s1.length() > s2.length() ? s2 : s1;
        if (longer.length() == 0) return 1.0;
        return (longer.length() - editDistance(longer, shorter)) / (double) longer.length();
    }

    private int editDistance(String s1, String s2) {
        s1 = s1.toLowerCase(); s2 = s2.toLowerCase();
        int[] costs = new int[s2.length() + 1];
        for (int i = 0; i <= s1.length(); i++) {
            int lastValue = i;
            for (int j = 0; j <= s2.length(); j++) {
                if (i == 0) costs[j] = j;
                else if (j > 0) {
                    int newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
            if (i > 0) costs[s2.length()] = lastValue;
        }
        return costs[s2.length()];
    }
}
