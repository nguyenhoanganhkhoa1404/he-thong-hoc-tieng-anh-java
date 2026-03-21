package com.englishwebsite.EnglishWebsite.auth_nhom1.service;

import com.englishwebsite.EnglishWebsite.auth_nhom1.dto.RegisterRequest;
import com.englishwebsite.EnglishWebsite.auth_nhom1.dto.TeacherRegisterRequest;
import com.englishwebsite.EnglishWebsite.model.User;
import java.time.LocalDateTime;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service xử lý logic nghiệp vụ cho User
 */
@Service
public class UserService {

    @Autowired
    private FirebaseAuthService firebaseAuthService;

    @Autowired
    private com.englishwebsite.EnglishWebsite.repository.UserRepository userRepository;

    /**
     * Đăng ký học viên
     */
    public User registerLearner(RegisterRequest request) throws FirebaseAuthException {
        UserRecord userRecord = firebaseAuthService.registerLearner(
                request.getEmail(),
                request.getPassword(),
                request.getDisplayName()
        );
        
        User user = firebaseAuthService.convertToUser(userRecord);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        // Lưu thông tin bổ sung vào MySQL
        userRepository.save(user);
        
        return user;
    }

    /**
     * Đăng ký giáo viên
     */
    public User registerTeacher(TeacherRegisterRequest request) throws FirebaseAuthException {
        UserRecord userRecord = firebaseAuthService.registerTeacher(
                request.getEmail(),
                request.getPassword(),
                request.getDisplayName(),
                request.getTeacherId()
        );
        
        User user = firebaseAuthService.convertToUser(userRecord);
        user.setTeacherId(request.getTeacherId());
        user.setSpecialization(request.getSpecialization());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setActive(false); // Default to inactive until approved
        
        // Lưu thông tin bổ sung vào MySQL
        userRepository.save(user);
        
        return user;
    }

    /**
     * Lấy thông tin user theo UID
     */
    public User getUserByUid(String uid) throws FirebaseAuthException {
        // Try getting from MySQL first for more details
        return userRepository.findById(uid).orElseGet(() -> {
            try {
                UserRecord userRecord = firebaseAuthService.getUserByUid(uid);
                return firebaseAuthService.convertToUser(userRecord);
            } catch (FirebaseAuthException e) {
                return null;
            }
        });
    }

    /**
     * Cập nhật thông tin user
     */
    public User updateUser(String uid, String displayName, String phoneNumber, String photoUrl) throws FirebaseAuthException {
        UserRecord userRecord = firebaseAuthService.updateUser(uid, displayName, phoneNumber, photoUrl);
        User user = firebaseAuthService.convertToUser(userRecord);
        
        userRepository.findById(uid).ifPresent(existing -> {
            existing.setDisplayName(displayName);
            existing.setPhoneNumber(phoneNumber);
            existing.setPhotoUrl(photoUrl);
            existing.setUpdatedAt(LocalDateTime.now());
            userRepository.save(existing);
        });
        
        return user;
    }
}
