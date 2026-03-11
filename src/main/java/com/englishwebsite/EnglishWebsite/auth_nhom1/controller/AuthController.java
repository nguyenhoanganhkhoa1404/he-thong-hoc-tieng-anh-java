package com.englishwebsite.EnglishWebsite.auth_nhom1.controller;

import com.englishwebsite.EnglishWebsite.auth_nhom1.dto.AuthResponse;
import com.englishwebsite.EnglishWebsite.auth_nhom1.dto.LoginRequest;
import com.englishwebsite.EnglishWebsite.auth_nhom1.dto.RegisterRequest;
import com.englishwebsite.EnglishWebsite.auth_nhom1.dto.TeacherRegisterRequest;
import com.englishwebsite.EnglishWebsite.auth_nhom1.service.UserService;
import com.englishwebsite.EnglishWebsite.model.User;
import com.google.firebase.auth.FirebaseAuthException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller xử lý các API xác thực và quản lý học viên
 * Nhóm 1 - Auth & User Management
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * Đăng ký học viên
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.registerLearner(request);
            AuthResponse response = new AuthResponse(null, user, "Đăng ký thành công");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (FirebaseAuthException e) {
            AuthResponse response = new AuthResponse();
            response.setMessage("Lỗi đăng ký: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Đăng ký giáo viên (trang riêng)
     * POST /api/auth/teacher/register
     */
    @PostMapping("/teacher/register")
    public ResponseEntity<AuthResponse> registerTeacher(@Valid @RequestBody TeacherRegisterRequest request) {
        try {
            User user = userService.registerTeacher(request);
            AuthResponse response = new AuthResponse(null, user, "Đăng ký giáo viên thành công");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (FirebaseAuthException e) {
            AuthResponse response = new AuthResponse();
            response.setMessage("Lỗi đăng ký giáo viên: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Đăng nhập (xác thực token từ front-end)
     * POST /api/auth/login
     * Front-end sẽ gửi Firebase ID Token, backend verify token
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        // Note: Thực tế, front-end sẽ tự xử lý đăng nhập với Firebase
        // và gửi ID Token về backend để verify
        // Ở đây chỉ là placeholder, sẽ cần implement verify token
        AuthResponse response = new AuthResponse();
        response.setMessage("Vui lòng sử dụng Firebase Authentication trên front-end và gửi ID Token");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    /**
     * Verify token và lấy thông tin user
     * POST /api/auth/verify
     */
    @PostMapping("/verify")
    public ResponseEntity<AuthResponse> verifyToken(@RequestHeader("Authorization") String token) {
        // Remove "Bearer " prefix if present
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        try {
            // Verify token và lấy user info
            // Implementation sẽ được thêm vào
            AuthResponse response = new AuthResponse();
            response.setMessage("Token verification - to be implemented");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            AuthResponse response = new AuthResponse();
            response.setMessage("Token không hợp lệ: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    /**
     * Lấy thông tin user hiện tại
     * GET /api/auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestHeader("Authorization") String token) {
        // Remove "Bearer " prefix if present
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        try {
            // Verify token và lấy user info
            // Implementation sẽ được thêm vào
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * Cập nhật thông tin user
     * PUT /api/auth/profile
     */
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody User userUpdate) {
        try {
            // Verify token và update user
            // Implementation sẽ được thêm vào
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Đăng xuất
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Firebase logout được xử lý ở front-end
        return ResponseEntity.status(HttpStatus.OK).body("Đăng xuất thành công");
    }
}
