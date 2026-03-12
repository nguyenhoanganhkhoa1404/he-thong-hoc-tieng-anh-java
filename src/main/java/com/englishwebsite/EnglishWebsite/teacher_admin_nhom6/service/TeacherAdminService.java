package com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.service;

import com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto.CourseDto;
import com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto.NotificationDto;
import com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto.TeacherAccountDto;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Service cho Nhóm 6 – Teacher / Admin:
 *  - Quản lý tài khoản giáo viên / admin (Chức năng 16)
 *  - Quản lý khoá học (Chức năng 17)
 *  - Hệ thống thông báo (Chức năng 18)
 *
 * Hiện dùng in-memory để demo. TODO: Kết nối Firestore khi tích hợp.
 */
@Service
public class TeacherAdminService {

    private final Map<String, TeacherAccountDto> teachers = new HashMap<>();
    private final Map<String, CourseDto> courses = new HashMap<>();
    private final Map<String, NotificationDto> notifications = new HashMap<>();
    private final Map<String, Set<String>> userNotificationIds = new HashMap<>();
    private final AtomicLong notificationIdGen = new AtomicLong(1);

    // -------- Teacher / Admin Management (16) --------

    public TeacherAccountDto createTeacher(TeacherAccountDto request) {
        String uid = request.getUid() != null ? request.getUid() : "T-" + UUID.randomUUID().toString().substring(0, 8);
        request.setUid(uid);
        if (request.getRole() == null) request.setRole("TEACHER");
        teachers.put(uid, request);
        return request;
    }

    public Optional<TeacherAccountDto> getTeacher(String uid) {
        return Optional.ofNullable(teachers.get(uid));
    }

    public Optional<TeacherAccountDto> approveTeacher(String uid) {
        TeacherAccountDto t = teachers.get(uid);
        if (t == null) return Optional.empty();
        t.setActive(true);
        return Optional.of(t);
    }

    public TeacherAccountDto updateTeacher(String uid, TeacherAccountDto request) {
        request.setUid(uid);
        teachers.put(uid, request);
        return request;
    }

    public void deleteTeacher(String uid) {
        teachers.remove(uid);
    }

    public List<TeacherAccountDto> listTeachers() {
        return new ArrayList<>(teachers.values());
    }

    // -------- Course Management (17) --------

    public CourseDto createCourse(CourseDto request) {
        String id = request.getId() != null ? request.getId() : "C-" + UUID.randomUUID().toString().substring(0, 8);
        request.setId(id);
        if (request.getModuleIds() == null) request.setModuleIds(Collections.emptyList());
        courses.put(id, request);
        return request;
    }

    public Optional<CourseDto> getCourse(String courseId) {
        return Optional.ofNullable(courses.get(courseId));
    }

    public CourseDto updateCourse(String courseId, CourseDto request) {
        request.setId(courseId);
        if (request.getModuleIds() == null) request.setModuleIds(Collections.emptyList());
        courses.put(courseId, request);
        return request;
    }

    public void deleteCourse(String courseId) {
        courses.remove(courseId);
    }

    public List<CourseDto> listCourses() {
        return new ArrayList<>(courses.values());
    }

    // -------- Notification System (18) --------

    public NotificationDto createNotification(NotificationDto request) {
        String id = "N-" + notificationIdGen.getAndIncrement();
        request.setId(id);
        request.setRead(false);
        if (request.getCreatedAt() == null) request.setCreatedAt(java.time.LocalDateTime.now());
        notifications.put(id, request);
        String targetType = request.getTargetType() != null ? request.getTargetType() : "ALL";
        String targetId = request.getTargetId();
        if ("USER".equals(targetType) && targetId != null) {
            userNotificationIds.computeIfAbsent(targetId, k -> new HashSet<>()).add(id);
        }
        if ("ALL".equals(targetType)) {
            for (String uid : teachers.keySet()) {
                userNotificationIds.computeIfAbsent(uid, k -> new HashSet<>()).add(id);
            }
        }
        return request;
    }

    public List<NotificationDto> listNotificationsForUser(String userId) {
        Set<String> ids = userNotificationIds.get(userId);
        if (ids == null) return Collections.emptyList();
        List<NotificationDto> list = new ArrayList<>();
        for (String id : ids) {
            NotificationDto n = notifications.get(id);
            if (n != null) list.add(n);
        }
        list.sort((a, b) -> {
            if (a.getCreatedAt() == null) return 1;
            if (b.getCreatedAt() == null) return -1;
            return b.getCreatedAt().compareTo(a.getCreatedAt());
        });
        return list;
    }

    public void markNotificationAsRead(String notificationId) {
        NotificationDto n = notifications.get(notificationId);
        if (n != null) n.setRead(true);
    }
}
