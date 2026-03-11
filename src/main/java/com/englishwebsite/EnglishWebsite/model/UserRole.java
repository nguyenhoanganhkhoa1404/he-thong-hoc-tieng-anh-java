package com.englishwebsite.EnglishWebsite.model;

/**
 * Enum định nghĩa các vai trò người dùng trong hệ thống
 */
public enum UserRole {
    LEARNER("LEARNER", "Học viên"),
    TEACHER("TEACHER", "Giáo viên"),
    ADMIN("ADMIN", "Quản trị viên");

    private final String code;
    private final String description;

    UserRole(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static UserRole fromString(String role) {
        for (UserRole r : UserRole.values()) {
            if (r.code.equalsIgnoreCase(role)) {
                return r;
            }
        }
        throw new IllegalArgumentException("Unknown role: " + role);
    }
}
