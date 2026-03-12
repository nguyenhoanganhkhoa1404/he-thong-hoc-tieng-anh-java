package com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.controller;

import com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto.CourseDto;
import com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto.NotificationDto;
import com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto.TeacherAccountDto;
import com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.service.TeacherAdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Nhóm 6 – Teacher / Admin (Khoa)
 *
 * Phạm vi:
 *  - Chức năng 16: Teacher / Admin Management
 *  - Chức năng 17: Course Management
 *  - Chức năng 18: Notification System
 *
 * Đây là khung REST API, chưa có logic kết nối Firebase.
 * TODO: Bổ sung bảo mật (chỉ cho phép role TEACHER / ADMIN truy cập).
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class TeacherAdminController {

    private final TeacherAdminService teacherAdminService;

    public TeacherAdminController(TeacherAdminService teacherAdminService) {
        this.teacherAdminService = teacherAdminService;
    }

    // -------- Teacher / Admin Management (16) --------

    @PostMapping("/teachers")
    public ResponseEntity<TeacherAccountDto> createTeacher(@RequestBody TeacherAccountDto request) {
        TeacherAccountDto result = teacherAdminService.createTeacher(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping("/teachers")
    public ResponseEntity<List<TeacherAccountDto>> listTeachers() {
        List<TeacherAccountDto> teachers = teacherAdminService.listTeachers();
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("/teachers/{uid}")
    public ResponseEntity<TeacherAccountDto> getTeacher(@PathVariable String uid) {
        return teacherAdminService.getTeacher(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/teachers/{uid}/approve")
    public ResponseEntity<TeacherAccountDto> approveTeacher(@PathVariable String uid) {
        return teacherAdminService.approveTeacher(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/teachers/{uid}")
    public ResponseEntity<TeacherAccountDto> updateTeacher(
            @PathVariable String uid,
            @RequestBody TeacherAccountDto request
    ) {
        TeacherAccountDto result = teacherAdminService.updateTeacher(uid, request);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/teachers/{uid}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable String uid) {
        teacherAdminService.deleteTeacher(uid);
        return ResponseEntity.noContent().build();
    }

    // -------- Course Management (17) --------

    @PostMapping("/courses")
    public ResponseEntity<CourseDto> createCourse(@RequestBody CourseDto request) {
        CourseDto result = teacherAdminService.createCourse(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping("/courses")
    public ResponseEntity<List<CourseDto>> listCourses() {
        List<CourseDto> courses = teacherAdminService.listCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<CourseDto> getCourse(@PathVariable String courseId) {
        return teacherAdminService.getCourse(courseId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/courses/{courseId}")
    public ResponseEntity<CourseDto> updateCourse(
            @PathVariable String courseId,
            @RequestBody CourseDto request
    ) {
        CourseDto result = teacherAdminService.updateCourse(courseId, request);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/courses/{courseId}")
    public ResponseEntity<Void> deleteCourse(@PathVariable String courseId) {
        teacherAdminService.deleteCourse(courseId);
        return ResponseEntity.noContent().build();
    }

    // -------- Notification System (18) --------

    @PostMapping("/notifications")
    public ResponseEntity<NotificationDto> createNotification(@RequestBody NotificationDto request) {
        NotificationDto result = teacherAdminService.createNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping("/notifications/user/{userId}")
    public ResponseEntity<List<NotificationDto>> listNotificationsForUser(@PathVariable String userId) {
        List<NotificationDto> notifications = teacherAdminService.listNotificationsForUser(userId);
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/notifications/{notificationId}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable String notificationId) {
        teacherAdminService.markNotificationAsRead(notificationId);
        return ResponseEntity.noContent().build();
    }
}

