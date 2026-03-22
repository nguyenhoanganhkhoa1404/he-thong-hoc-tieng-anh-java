package com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto;

public class StudentDto {
    private String uid;
    private String displayName;
    private String email;
    private String level;
    private int xp;

    public StudentDto() {}

    public StudentDto(String uid, String displayName, String email, String level, int xp) {
        this.uid = uid;
        this.displayName = displayName;
        this.email = email;
        this.level = level;
        this.xp = xp;
    }

    public String getUid() { return uid; }
    public void setUid(String uid) { this.uid = uid; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public int getXp() { return xp; }
    public void setXp(int xp) { this.xp = xp; }
}
