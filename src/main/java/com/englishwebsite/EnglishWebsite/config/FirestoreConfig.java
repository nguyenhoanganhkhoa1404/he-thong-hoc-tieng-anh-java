package com.englishwebsite.EnglishWebsite.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Firestore configuration placeholder.
 *
 * Nếu muốn bật Firestore, cài đặt:
 *  firebase.enabled=true
 *  firebase.project-id=<your-project-id>
 *  firebase.credentials.path=classpath:firebase-service-account.json
 *
 * Hiện tại hệ thống sẽ chạy ở chế độ MySQL mặc định.
 */
@Configuration
public class FirestoreConfig {

    @Bean
    @ConditionalOnProperty(name = "firebase.enabled", havingValue = "true")
    public String firestoreConfiguration() {
        // TODO: Thực hiện khởi tạo Firestore client khi gói thư viện firebase-admin được thêm vào pom.
        // Hiện tại chỉ dùng bean giả để tránh lỗi khởi tạo application context nếu không cấu hình.
        return "firestore-enabled";
    }
}
