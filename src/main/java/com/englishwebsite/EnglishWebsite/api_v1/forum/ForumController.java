package com.englishwebsite.EnglishWebsite.api_v1.forum;

import com.englishwebsite.EnglishWebsite.model.ForumComment;
import com.englishwebsite.EnglishWebsite.model.ForumNotification;
import com.englishwebsite.EnglishWebsite.model.ForumPost;
import com.englishwebsite.EnglishWebsite.repository.ForumCommentRepository;
import com.englishwebsite.EnglishWebsite.repository.ForumNotificationRepository;
import com.englishwebsite.EnglishWebsite.repository.ForumPostRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/v1/forum")
@CrossOrigin(origins = "*")
public class ForumController {

    private final ForumPostRepository forumRepo;
    private final ForumCommentRepository commentRepo;
    private final ForumNotificationRepository notifRepo;

    public ForumController(ForumPostRepository forumRepo, ForumCommentRepository commentRepo, ForumNotificationRepository notifRepo) {
        this.forumRepo = forumRepo;
        this.commentRepo = commentRepo;
        this.notifRepo = notifRepo;
    }

    public static class PostResponse {
        public ForumPost post;
        public List<ForumComment> comments;
        public PostResponse() {}
        public PostResponse(ForumPost post, List<ForumComment> comments) {
            this.post = post;
            this.comments = comments;
        }
    }

    @GetMapping("/posts")
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        List<PostResponse> responses = forumRepo.findAll().stream()
                .map(p -> new PostResponse(p, commentRepo.findByPostIdOrderByCreatedAtAsc(p.getId())))
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/posts")
    public ResponseEntity<ForumPost> createPost(@RequestBody ForumPost post) {
        post.setId("FP-" + UUID.randomUUID().toString().substring(0, 8));
        post.setCreatedAt(LocalDateTime.now());
        if (post.getAuthorId() == null || post.getAuthorId().isEmpty()) {
            post.setAuthorId("user-demo");
        }
        ForumPost saved = forumRepo.save(post);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/posts/{id}/like")
    public ResponseEntity<?> likePost(@PathVariable String id) {
        Optional<ForumPost> opt = forumRepo.findById(id);
        if (opt.isPresent()) {
            ForumPost post = opt.get();
            post.setLikes(post.getLikes() + 1);
            forumRepo.save(post);
            return ResponseEntity.ok(post);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/posts/{id}/comments")
    public ResponseEntity<List<ForumComment>> getComments(@PathVariable String id) {
        return ResponseEntity.ok(commentRepo.findByPostIdOrderByCreatedAtAsc(id));
    }

    @PostMapping("/posts/{id}/comments")
    public ResponseEntity<ForumComment> addComment(@PathVariable String id, @RequestBody ForumComment comment) {
        comment.setId("FC-" + UUID.randomUUID().toString().substring(0, 8));
        comment.setPostId(id);
        comment.setCreatedAt(LocalDateTime.now());
        if (comment.getAuthorId() == null || comment.getAuthorId().isEmpty()) {
            comment.setAuthorId("user-demo");
        }
        ForumComment saved = commentRepo.save(comment);

        // --- Notification Logic ---
        String author = saved.getAuthorId();
        
        // 1. Notify tagged users
        Pattern pattern = Pattern.compile("@\\[(.*?)\\]");
        Matcher matcher = pattern.matcher(saved.getContent());
        while (matcher.find()) {
            String taggedUser = matcher.group(1);
            ForumNotification n = new ForumNotification();
            n.setId("FN-" + UUID.randomUUID().toString().substring(0, 8));
            n.setUserId(taggedUser);
            n.setSenderId(author);
            n.setPostId(id);
            n.setMessage(author + " mentioned you in a comment.");
            n.setCreatedAt(LocalDateTime.now());
            notifRepo.save(n);
        }

        // 2. Notify post owner (if they weren't just tagged)
        forumRepo.findById(id).ifPresent(post -> {
            boolean alreadyTagged = saved.getContent().contains("@[" + post.getAuthorId() + "]");
            if (!alreadyTagged) {
                ForumNotification n = new ForumNotification();
                n.setId("FN-" + UUID.randomUUID().toString().substring(0, 8));
                n.setUserId(post.getAuthorId());
                n.setSenderId(author);
                n.setPostId(id);
                n.setMessage(author + " replied to your post.");
                n.setCreatedAt(LocalDateTime.now());
                notifRepo.save(n);
            }
        });

        return ResponseEntity.ok(saved);
    }

    // --- Notification Endpoints ---

    @GetMapping("/notifications/{userId}")
    public ResponseEntity<List<ForumNotification>> getNotifications(@PathVariable String userId) {
        return ResponseEntity.ok(notifRepo.findByUserIdOrderByCreatedAtDesc(userId));
    }

    @PostMapping("/notifications/{id}/read")
    public ResponseEntity<?> markNotificationRead(@PathVariable String id) {
        Optional<ForumNotification> opt = notifRepo.findById(id);
        if (opt.isPresent()) {
            ForumNotification n = opt.get();
            n.setRead(true);
            notifRepo.save(n);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
