package com.englishwebsite.EnglishWebsite.auth_nhom1.controller;

import com.englishwebsite.EnglishWebsite.auth_nhom1.dto.AuthResponse;
import com.englishwebsite.EnglishWebsite.auth_nhom1.dto.LoginRequest;
import com.englishwebsite.EnglishWebsite.auth_nhom1.dto.RegisterRequest;
import com.englishwebsite.EnglishWebsite.auth_nhom1.dto.TeacherRegisterRequest;
import com.englishwebsite.EnglishWebsite.auth_nhom1.service.UserService;
import com.englishwebsite.EnglishWebsite.model.User;
import com.englishwebsite.EnglishWebsite.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.registerLearner(request);
            AuthResponse response = new AuthResponse(null, user, "Đăng ký thành công");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            AuthResponse response = new AuthResponse();
            response.setMessage("Lỗi đăng ký: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/teacher/register")
    public ResponseEntity<AuthResponse> registerTeacher(@Valid @RequestBody TeacherRegisterRequest request) {
        try {
            User user = userService.registerTeacher(request);
            AuthResponse response = new AuthResponse(null, user, "Đăng ký giáo viên thành công. Vui lòng chờ duyệt.");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            AuthResponse response = new AuthResponse();
            response.setMessage("Lỗi đăng ký giáo viên: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generate Token
            String jwt = tokenProvider.generateToken(authentication);
            
            // Get User INFO
            User user = userService.getUserByEmail(request.getEmail());

            AuthResponse response = new AuthResponse(jwt, user, "Đăng nhập thành công");
            return ResponseEntity.ok(response);
        } catch (org.springframework.security.core.AuthenticationException e) {
            AuthResponse response = new AuthResponse();
            response.setMessage("Sai email hoặc mật khẩu");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<AuthResponse> verifyToken(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        if (tokenProvider.validateToken(token)) {
            String email = tokenProvider.getUsernameFromToken(token);
            User user = userService.getUserByEmail(email);
            AuthResponse response = new AuthResponse(token, user, "Token hợp lệ");
            return ResponseEntity.ok(response);
        } else {
            AuthResponse response = new AuthResponse();
            response.setMessage("Token không hợp lệ");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody User userUpdate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authentication.getName();
        try {
            User updatedUser = userService.updateUser(
                email, 
                userUpdate.getDisplayName(), 
                userUpdate.getPhoneNumber(), 
                userUpdate.getPhotoUrl()
            );
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok("Đăng xuất thành công");
    }
}
