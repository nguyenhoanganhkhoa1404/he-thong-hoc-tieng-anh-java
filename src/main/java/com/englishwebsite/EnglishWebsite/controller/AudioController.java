package com.englishwebsite.EnglishWebsite.controller;

import com.englishwebsite.EnglishWebsite.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/audio")
public class AudioController {

    private final AIService aiService;
    private final String uploadDir = "uploads/audio/";

    public AudioController(AIService aiService) {
        this.aiService = aiService;
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadAudio(@RequestParam("file") MultipartFile file, 
                                       @RequestParam("originalText") String originalText,
                                       @RequestParam(value = "localTranscript", required = false) String localTranscript) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Get real transcription using AIService (with local fallback if Whisper hits quota)
            String transcribedText = aiService.transcribeAudio(file.getBytes(), fileName, originalText, localTranscript);
            Map<String, Object> aiResult = aiService.analyzeSpeaking(transcribedText, originalText);

            AudioAnalysisResponse response = new AudioAnalysisResponse(
                fileName, 
                (String) aiResult.get("transcribedText"), 
                (String) aiResult.get("analysis")
            );
            response.fluencyScore = (int) aiResult.get("fluencyScore");
            response.pronunciationScore = (int) aiResult.get("pronunciationScore");
            response.stressScore = (int) aiResult.get("stressScore");
            response.speakingSpeed = (int) aiResult.get("speakingSpeed");

            return ResponseEntity.ok().body(response);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload: " + e.getMessage());
        }
    }

    private static class AudioAnalysisResponse {
        public String fileName;
        public String transcribedText;
        public String analysis;
        public int fluencyScore;
        public int pronunciationScore;
        public int speakingSpeed;
        public int stressScore;

        public AudioAnalysisResponse(String fileName, String transcribedText, String analysis) {
            this.fileName = fileName;
            this.transcribedText = transcribedText;
            this.analysis = analysis;
        }
    }
}
