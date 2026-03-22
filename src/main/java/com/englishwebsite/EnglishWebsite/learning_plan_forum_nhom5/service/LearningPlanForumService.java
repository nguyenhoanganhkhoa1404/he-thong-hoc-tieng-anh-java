package com.englishwebsite.EnglishWebsite.learning_plan_forum_nhom5.service;

import com.englishwebsite.EnglishWebsite.learning_plan_forum_nhom5.dto.AchievementDto;
import com.englishwebsite.EnglishWebsite.learning_plan_forum_nhom5.dto.DailyPlanDto;
import com.englishwebsite.EnglishWebsite.learning_plan_forum_nhom5.dto.ForumPostDto;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * Service xử lý nghiệp vụ nhóm 5: Achievements, Daily Plan, Forum.
 * Hiện tại sử dụng lưu trữ in‑memory cho demo;
 * TODO: thay bằng Firestore theo yêu cầu thực tế.
 */
@Service
public class LearningPlanForumService {

    private final Map<String, List<AchievementDto>> achievementsByUser = new HashMap<>();
    private final List<AchievementDto> masterAchievementList = new ArrayList<>();

    private final Map<String, DailyPlanDto> plansByKey = new HashMap<>(); // key = userId + "|" + date

    private final Map<String, ForumPostDto> posts = new LinkedHashMap<>();

    private final AtomicLong achievementIdGen = new AtomicLong(1);
    private final AtomicLong planIdGen = new AtomicLong(1);
    private final AtomicLong taskIdGen = new AtomicLong(1);
    private final AtomicLong postIdGen = new AtomicLong(1);
    private final AtomicLong commentIdGen = new AtomicLong(1);

    public LearningPlanForumService() {
        // tạo một vài thành tựu mẫu
        masterAchievementList.add(makeAchievement("A-1", "10‑day streak", "Hoàn thành bài mỗi ngày 10 ngày liên tiếp"));
        masterAchievementList.add(makeAchievement("A-2", "100 quizzes", "Hoàn thành 100 bài quiz"));
        masterAchievementList.add(makeAchievement("A-3", "First post", "Đăng bài đầu tiên lên diễn đàn"));
    }

    private AchievementDto makeAchievement(String id, String name, String desc) {
        AchievementDto a = new AchievementDto();
        a.setId(id);
        a.setName(name);
        a.setDescription(desc);
        return a;
    }

    // --- Achievements ---

    public List<AchievementDto> getAchievementsForUser(String userId) {
        // trả về danh sách đã mở khóa của user
        return achievementsByUser.getOrDefault(userId, Collections.emptyList());
    }

    public List<AchievementDto> getAvailableAchievementsForUser(String userId) {
        List<AchievementDto> unlocked = getAchievementsForUser(userId);
        return masterAchievementList.stream()
                .filter(a -> unlocked.stream().noneMatch(u -> u.getId().equals(a.getId())))
                .collect(Collectors.toList());
    }

    public AchievementDto unlockAchievement(String userId, String achievementId) {
        AchievementDto found = masterAchievementList.stream()
                .filter(a -> a.getId().equals(achievementId))
                .findFirst().orElse(null);
        if (found == null) return null;
        AchievementDto copy = new AchievementDto();
        copy.setId(found.getId());
        copy.setName(found.getName());
        copy.setDescription(found.getDescription());
        copy.setUnlocked(true);
        copy.setDateUnlocked(LocalDateTime.now());
        achievementsByUser.computeIfAbsent(userId, k -> new ArrayList<>()).add(copy);
        return copy;
    }

    // --- Daily plan ---

    public DailyPlanDto getPlan(String userId, String date) {
        return plansByKey.get(userId + "|" + date);
    }

    public DailyPlanDto createOrUpdatePlan(DailyPlanDto plan) {
        if (plan.getId() == null) {
            plan.setId("P-" + planIdGen.getAndIncrement());
            plan.getTasks().forEach(t -> t.setId("T-" + taskIdGen.getAndIncrement()));
        }
        plansByKey.put(plan.getUserId() + "|" + plan.getDate(), plan);
        return plan;
    }

    public DailyPlanDto markTask(String userId, String planId, String taskId, boolean completed) {
        Optional<DailyPlanDto> opt = plansByKey.values().stream()
                .filter(p -> p.getId().equals(planId) && p.getUserId().equals(userId))
                .findFirst();
        if (!opt.isPresent()) return null;
        DailyPlanDto plan = opt.get();
        plan.getTasks().stream()
                .filter(t -> t.getId().equals(taskId))
                .findFirst()
                .ifPresent(t -> t.setCompleted(completed));
        return plan;
    }

    // --- Forum ---

    public List<ForumPostDto> listPosts() {
        return new ArrayList<>(posts.values());
    }

    public ForumPostDto getPost(String id) {
        return posts.get(id);
    }

    public ForumPostDto createPost(ForumPostDto post) {
        String id = "FP-" + postIdGen.getAndIncrement();
        post.setId(id);
        post.setCreatedAt(LocalDateTime.now());
        posts.put(id, post);
        // nếu là thành công mở khóa achievement "First post"
        unlockAchievement(post.getAuthorId(), "A-3");
        return post;
    }

    public ForumPostDto updatePost(String id, ForumPostDto updated) {
        ForumPostDto existing = posts.get(id);
        if (existing == null) return null;
        existing.setTitle(updated.getTitle());
        existing.setContent(updated.getContent());
        return existing;
    }

    public boolean deletePost(String id) {
        return posts.remove(id) != null;
    }

    public ForumPostDto addComment(String postId, ForumPostDto.CommentDto comment) {
        ForumPostDto post = posts.get(postId);
        if (post == null) return null;
        comment.setId("C-" + commentIdGen.getAndIncrement());
        comment.setCreatedAt(LocalDateTime.now());
        post.getComments().add(comment);
        return post;
    }
}
