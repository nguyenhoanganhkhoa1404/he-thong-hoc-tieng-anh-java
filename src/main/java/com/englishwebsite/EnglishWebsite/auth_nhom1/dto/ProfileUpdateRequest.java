package com.englishwebsite.EnglishWebsite.auth_nhom1.dto;

import jakarta.validation.constraints.Pattern;

/**
 * DTO cho request cập nhật hồ sơ người dùng
 */
public class ProfileUpdateRequest {
    private String displayName;
    private String phoneNumber;
    private String photoUrl;

    /** Level tiếng Anh: A1, A2, B1, B2, C1, C2 */
    @Pattern(regexp = "^(A1|A2|B1|B2|C1|C2)?$", message = "Level phải là một trong: A1, A2, B1, B2, C1, C2")
    private String level;

    public ProfileUpdateRequest() {
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}
