package com.englishwebsite.EnglishWebsite.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
// 🔥 THÊM MỚI: Cần 2 import này để gọi Firestore
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.project-id}")
    private String projectId;

    @PostConstruct
    public void initialize() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                // Đảm bảo file firebase-service-account.json nằm trong thư mục src/main/resources
                InputStream serviceAccount = new ClassPathResource("firebase-service-account.json").getInputStream();
                
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .setProjectId(projectId)
                        .build();

                FirebaseApp.initializeApp(options);
                System.out.println("✅ [FIREBASE] Đã khởi tạo Firebase Admin SDK thành công (Dùng Firestore)!");
            }
        } catch (IOException e) {
            throw new RuntimeException("❌ Lỗi khởi tạo Firebase: " + e.getMessage());
        }
    }

    @Bean
    public FirebaseAuth firebaseAuth() {
        return FirebaseAuth.getInstance();
    }

    // 🔥 THÊM MỚI: Biến Firestore thành một Bean để bơm (Inject) đi khắp nơi
    @Bean
    public Firestore firestore() {
        return FirestoreClient.getFirestore();
    }
}