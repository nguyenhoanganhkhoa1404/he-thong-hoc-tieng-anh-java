package com.englishwebsite.EnglishWebsite.auth_nhom1.service;

import com.englishwebsite.EnglishWebsite.auth_nhom1.dto.RegisterRequest;
import com.englishwebsite.EnglishWebsite.auth_nhom1.dto.TeacherRegisterRequest;
import com.englishwebsite.EnglishWebsite.model.User;
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
        
        // Lưu thông tin bổ sung vào Firestore (sẽ implement sau)
        // userService.saveUserToFirestore(user);
        
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
        
        // Lưu thông tin bổ sung vào Firestore (sẽ implement sau)
        // userService.saveUserToFirestore(user);
        
        return user;
    }

    /**
     * Lấy thông tin user theo UID
     */
    public User getUserByUid(String uid) throws FirebaseAuthException {
        UserRecord userRecord = firebaseAuthService.getUserByUid(uid);
        return firebaseAuthService.convertToUser(userRecord);
    }

    /**
     * Cập nhật thông tin user
     */
    public User updateUser(String uid, String displayName, String phoneNumber, String photoUrl) throws FirebaseAuthException {
        UserRecord userRecord = firebaseAuthService.updateUser(uid, displayName, phoneNumber, photoUrl);
        return firebaseAuthService.convertToUser(userRecord);
    }
}
