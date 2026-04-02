package com.englishwebsite.EnglishWebsite.auth_nhom1.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO cho request đăng nhập.
 * Front-end đăng nhập bằng Firebase (email/password), lấy ID Token rồi gửi idToken lên backend.
 */
public class LoginRequest {
    @Email(message = "Email không hợp lệ")
    private String email;

    private String password;

    /** Firebase ID Token sau khi đăng nhập thành công ở client */
    private String idToken;

    public LoginRequest() {
    }

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }
}
