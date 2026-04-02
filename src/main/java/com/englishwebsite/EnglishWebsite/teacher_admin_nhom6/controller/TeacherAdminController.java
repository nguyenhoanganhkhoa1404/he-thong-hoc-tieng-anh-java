package com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.controller;

import com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto.*;
import com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.service.TeacherAdminService;
import com.englishwebsite.EnglishWebsite.service.FileParsingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
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
    private final FileParsingService fileParsingService;

    public TeacherAdminController(TeacherAdminService teacherAdminService, FileParsingService fileParsingService) {
        this.teacherAdminService = teacherAdminService;
        this.fileParsingService = fileParsingService;
    }

    @PostMapping("/test-sets/parse-file")
    public ResponseEntity<?> parseFile(@RequestParam("file") MultipartFile file) {
        try {
            Map<String, Object> result = fileParsingService.parseFile(file);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error parsing file: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
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

    @GetMapping("/students")
    public ResponseEntity<List<com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto.StudentDto>> listStudents() {
        return ResponseEntity.ok(teacherAdminService.listStudents());
    }

    @GetMapping("/teachers/{uid}")
    public ResponseEntity<TeacherAccountDto> getTeacher(@PathVariable String uid) {
        return teacherAdminService.getTeacher(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/users/{uid}")
    public ResponseEntity<com.englishwebsite.EnglishWebsite.model.User> getUserProfile(@PathVariable String uid) {
        return teacherAdminService.getUserProfile(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{uid}/profile")
    public ResponseEntity<com.englishwebsite.EnglishWebsite.model.User> updateUserProfile(
            @PathVariable String uid,
            @RequestBody com.englishwebsite.EnglishWebsite.model.User updateReq
    ) {
        return teacherAdminService.updateUserProfile(uid, updateReq)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/students/{uid}/level")
    public ResponseEntity<com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto.StudentDto> updateStudentLevel(
            @PathVariable String uid,
            @RequestParam String level,
            @RequestParam(required = false, defaultValue="0") Integer score
    ) {
        return teacherAdminService.updateStudentLevel(uid, level, score)
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

    @GetMapping("/courses/teacher/{teacherId}")
    public ResponseEntity<List<CourseDto>> listCoursesByTeacher(@PathVariable String teacherId) {
        List<CourseDto> courses = teacherAdminService.listCoursesByTeacher(teacherId);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/stats/teacher/{teacherId}")
    public ResponseEntity<com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto.TeacherStatsDto> getTeacherStats(@PathVariable String teacherId) {
        com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto.TeacherStatsDto stats = teacherAdminService.getTeacherStats(teacherId);
        return ResponseEntity.ok(stats);
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

    // -------- Test Set Management (Nhóm 6: Khoa) --------

    @PostMapping("/test-sets")
    public ResponseEntity<TestSetDto> createTestSet(@RequestBody TestSetDto request) {
        TestSetDto result = teacherAdminService.createTestSet(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping("/test-sets/teacher/{teacherId}")
    public ResponseEntity<List<TestSetDto>> listTestSetsByTeacher(@PathVariable String teacherId) {
        return ResponseEntity.ok(teacherAdminService.listTestSetsByTeacher(teacherId));
    }

    @GetMapping("/test-sets/{id}")
    public ResponseEntity<TestSetDto> getTestSet(@PathVariable String id) {
        return teacherAdminService.getTestSet(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/test-sets/{id}")
    public ResponseEntity<TestSetDto> updateTestSet(@PathVariable String id, @RequestBody TestSetDto request) {
        return ResponseEntity.ok(teacherAdminService.updateTestSet(id, request));
    }

    @DeleteMapping("/test-sets/{id}")
    public ResponseEntity<Void> deleteTestSet(@PathVariable String id) {
        teacherAdminService.deleteTestSet(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/test-sets/{id}/questions")
    public ResponseEntity<QuizQuestionDto> saveQuestionToTestSet(@PathVariable String id, @RequestBody QuizQuestionDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(teacherAdminService.saveQuestionToTestSet(id, request));
    }

    @GetMapping("/test-sets/{id}/questions")
    public ResponseEntity<List<QuizQuestionDto>> listQuestionsByTestSet(@PathVariable String id) {
        return ResponseEntity.ok(teacherAdminService.listQuestionsByTestSet(id));
    }

    @DeleteMapping("/questions/{questionId}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable String questionId) {
        teacherAdminService.deleteQuestion(questionId);
        return ResponseEntity.noContent().build();
    }
}

