package com.englishwebsite.EnglishWebsite.auth_nhom1.service;

import com.englishwebsite.EnglishWebsite.auth_nhom1.dto.RegisterRequest;
import com.englishwebsite.EnglishWebsite.auth_nhom1.dto.TeacherRegisterRequest;
import com.englishwebsite.EnglishWebsite.model.User;
import com.englishwebsite.EnglishWebsite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service xử lý logic nghiệp vụ cho User
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Đăng ký học viên
     */
    public User registerLearner(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        User user = new User();
        user.setUid(UUID.randomUUID().toString());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setDisplayName(request.getDisplayName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole("LEARNER");
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }

    /**
     * Đăng ký giáo viên
     */
    public User registerTeacher(TeacherRegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        User user = new User();
        user.setUid(UUID.randomUUID().toString());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setDisplayName(request.getDisplayName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole("TEACHER");
        user.setTeacherId(request.getTeacherId());
        user.setSpecialization(request.getSpecialization());
        user.setActive(true); // Auto-active for testing purposes (normally requires Admin approval)
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }

    /**
     * Lấy thông tin user theo Email
     */
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    /**
     * Cập nhật thông tin user
     */
    public User updateUser(String email, String displayName, String phoneNumber, String photoUrl) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
        
        user.setDisplayName(displayName);
        user.setPhoneNumber(phoneNumber);
        user.setPhotoUrl(photoUrl);
        user.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }

    public void addXp(String userId, int amount) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("No user found"));
        int currentXp = user.getXp() != null ? user.getXp() : 0;
        user.setXp(currentXp + amount);
        userRepository.save(user);
    }

    public void updateStreak(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("No user found"));
        int streak = user.getStreak() != null ? user.getStreak() : 0;
        user.setStreak(streak + 1);
        userRepository.save(user);
    }

    public User getUserById(String uid) {
        return userRepository.findById(uid).orElse(null);
    }

    public User saveUser(User user) {
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public User promoteUserLevel(String email) {
        User user = getUserByEmail(email);
        if (user != null) {
            user.promoteLevel();
            return userRepository.save(user);
        }
        return null;
    }

    public User demoteUserLevel(String email) {
        User user = getUserByEmail(email);
        if (user != null) {
            user.demoteLevel();
            return userRepository.save(user);
        }
        return null;
    }

    public User setUserLevel(String userId, String level) {
        User user = getUserById(userId);
        if (user != null) {
            user.setLevel(level);
            return userRepository.save(user);
        }
        return null;
    }

    public User updateUserLevel(String userId, boolean promote) {
        User user = getUserById(userId);
        if (user != null) {
            if (promote) user.promoteLevel();
            else user.demoteLevel();
            user.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(user);
        }
        return null;
    }
}
