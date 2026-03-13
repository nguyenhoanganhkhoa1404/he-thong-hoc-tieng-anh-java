package com.englishwebsite.EnglishWebsite.learning_plan_forum_nhom5.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO cho bài viết diễn đàn và phần bình luận.
 * Nhóm 5 – Discussion Forum (Chức năng 15).
 */
public class ForumPostDto {
    private String id;
    private String authorId;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private List<CommentDto> comments = new ArrayList<>();

    public ForumPostDto() { }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<CommentDto> getComments() { return comments; }
    public void setComments(List<CommentDto> comments) { this.comments = comments; }

    public static class CommentDto {
        private String id;
        private String authorId;
        private String content;
        private LocalDateTime createdAt;

        public CommentDto() { }
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getAuthorId() { return authorId; }
        public void setAuthorId(String authorId) { this.authorId = authorId; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}
