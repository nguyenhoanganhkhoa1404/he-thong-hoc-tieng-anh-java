package com.englishwebsite.EnglishWebsite.auth_nhom1.service;

import com.englishwebsite.EnglishWebsite.model.User;
import com.englishwebsite.EnglishWebsite.model.UserRole;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Service xử lý xác thực với Firebase Authentication
 */
@Service
public class FirebaseAuthService {

    @Autowired
    private FirebaseAuth firebaseAuth;

    /**
     * Đăng ký học viên mới
     */
    public UserRecord registerLearner(String email, String password, String displayName) throws FirebaseAuthException {
        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(email)
                .setPassword(password)
                .setDisplayName(displayName)
                .setDisabled(false);

        UserRecord userRecord = firebaseAuth.createUser(request);
        
        // Set custom claims cho role
        setCustomUserClaims(userRecord.getUid(), UserRole.LEARNER.getCode());
        
        return userRecord;
    }

    /**
     * Đăng ký giáo viên mới
     */
    public UserRecord registerTeacher(String email, String password, String displayName, String teacherId) throws FirebaseAuthException {
        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(email)
                .setPassword(password)
                .setDisplayName(displayName)
                .setDisabled(false);

        UserRecord userRecord = firebaseAuth.createUser(request);
        
        // Set custom claims cho role
        setCustomUserClaims(userRecord.getUid(), UserRole.TEACHER.getCode());
        
        return userRecord;
    }

    /**
     * Xác thực token và lấy thông tin user
     */
    public FirebaseToken verifyToken(String idToken) throws FirebaseAuthException {
        return firebaseAuth.verifyIdToken(idToken);
    }

    /**
     * Lấy thông tin user từ Firebase
     */
    public UserRecord getUserByUid(String uid) throws FirebaseAuthException {
        return firebaseAuth.getUser(uid);
    }

    /**
     * Lấy thông tin user từ email
     */
    public UserRecord getUserByEmail(String email) throws FirebaseAuthException {
        return firebaseAuth.getUserByEmail(email);
    }

    /**
     * Set custom claims cho user (role)
     */
    private void setCustomUserClaims(String uid, String role) throws FirebaseAuthException {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        firebaseAuth.setCustomUserClaims(uid, claims);
    }

    /**
     * Chuyển đổi UserRecord thành User model
     */
    public User convertToUser(UserRecord userRecord) {
        User user = new User();
        user.setUid(userRecord.getUid());
        user.setEmail(userRecord.getEmail());
        user.setDisplayName(userRecord.getDisplayName());
        user.setPhoneNumber(userRecord.getPhoneNumber());
        user.setPhotoUrl(userRecord.getPhotoUrl());
        user.setEmailVerified(userRecord.isEmailVerified());
        
        // Lấy role từ custom claims
        if (userRecord.getCustomClaims() != null && userRecord.getCustomClaims().containsKey("role")) {
            user.setRole((String) userRecord.getCustomClaims().get("role"));
        }
        
        return user;
    }

    /**
     * Cập nhật thông tin user
     */
    public UserRecord updateUser(String uid, String displayName, String phoneNumber, String photoUrl) throws FirebaseAuthException {
        UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(uid);
        
        if (displayName != null) {
            request.setDisplayName(displayName);
        }
        if (phoneNumber != null) {
            request.setPhoneNumber(phoneNumber);
        }
        if (photoUrl != null) {
            request.setPhotoUrl(photoUrl);
        }
        
        return firebaseAuth.updateUser(request);
    }

    /**
     * Xóa user
     */
    public void deleteUser(String uid) throws FirebaseAuthException {
        firebaseAuth.deleteUser(uid);
    }
}
