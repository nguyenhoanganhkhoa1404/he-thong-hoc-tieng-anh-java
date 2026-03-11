package com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.service;

import com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto.CourseDto;
import com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto.NotificationDto;
import com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto.TeacherAccountDto;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 * Service cho Nhóm 6 – Teacher / Admin:
 *  - Quản lý tài khoản giáo viên / admin (Chức năng 16)
 *  - Quản lý khoá học (Chức năng 17)
 *  - Hệ thống thông báo (Chức năng 18)
 *
 * TODO: Kết nối Firestore / Realtime Database để lưu trữ thật.
 */
@Service
public class TeacherAdminService {

    // -------- Teacher / Admin Management --------

    public TeacherAccountDto createTeacher(TeacherAccountDto request) {
        // TODO: Tạo tài khoản giáo viên / admin trong Firebase + lưu thông tin bổ sung
        return request;
    }

    public TeacherAccountDto updateTeacher(String uid, TeacherAccountDto request) {
        // TODO: Cập nhật thông tin giáo viên / admin
        request.setUid(uid);
        return request;
    }

    public void deleteTeacher(String uid) {
        // TODO: Xoá giáo viên / admin
    }

    public List<TeacherAccountDto> listTeachers() {
        // TODO: Lấy danh sách giáo viên / admin
        return Collections.emptyList();
    }

    // -------- Course Management --------

    public CourseDto createCourse(CourseDto request) {
        // TODO: Tạo khoá học mới
        return request;
    }

    public CourseDto updateCourse(String courseId, CourseDto request) {
        // TODO: Cập nhật khoá học
        request.setId(courseId);
        return request;
    }

    public void deleteCourse(String courseId) {
        // TODO: Xoá khoá học
    }

    public List<CourseDto> listCourses() {
        // TODO: Lấy danh sách khoá học
        return Collections.emptyList();
    }

    // -------- Notification System --------

    public NotificationDto createNotification(NotificationDto request) {
        // TODO: Tạo thông báo và gửi tới người dùng / lớp / khoá học
        return request;
    }

    public List<NotificationDto> listNotificationsForUser(String userId) {
        // TODO: Lấy danh sách thông báo cho một user
        return Collections.emptyList();
    }

    public void markNotificationAsRead(String notificationId) {
        // TODO: Đánh dấu thông báo đã đọc
    }
}

