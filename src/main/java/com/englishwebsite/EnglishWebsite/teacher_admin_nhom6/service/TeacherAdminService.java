package com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.service;

import com.englishwebsite.EnglishWebsite.model.Course;
import com.englishwebsite.EnglishWebsite.model.Notification;
import com.englishwebsite.EnglishWebsite.model.User;
import com.englishwebsite.EnglishWebsite.repository.CourseRepository;
import com.englishwebsite.EnglishWebsite.repository.NotificationRepository;
import com.englishwebsite.EnglishWebsite.repository.UserRepository;
import com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto.CourseDto;
import com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto.NotificationDto;
import com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto.TeacherAccountDto;
import com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto.TeacherStatsDto;
import com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto.StudentDto;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service cho Nhóm 6 – Teacher / Admin:
 *  - Quản lý tài khoản giáo viên / admin (Chức năng 16)
 *  - Quản lý khoá học (Chức năng 17)
 *  - Hệ thống thông báo (Chức năng 18)
 *
 * Lưu/đọc dữ liệu từ MySQL (JPA).
 */
@Service
public class TeacherAdminService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final NotificationRepository notificationRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public TeacherAdminService(UserRepository userRepository,
                               CourseRepository courseRepository,
                               NotificationRepository notificationRepository,
                               org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // -------- Teacher / Admin Management (16) --------

    public TeacherAccountDto createTeacher(TeacherAccountDto request) {
        String uid = request.getUid() != null ? request.getUid() : "T-" + UUID.randomUUID().toString().substring(0, 8);
        User user = userRepository.findById(uid).orElse(new User());
        user.setUid(uid);
        user.setEmail(request.getEmail());
        user.setDisplayName(request.getDisplayName());
        user.setRole(request.getRole() != null ? request.getRole() : "TEACHER");
        user.setTeacherId(request.getTeacherId());
        user.setSpecialization(request.getSpecialization());
        user.setActive(request.isActive());
        userRepository.save(user);
        return request;
    }

    public Optional<TeacherAccountDto> getTeacher(String uid) {
        return userRepository.findById(uid).map(this::convertToTeacherDto);
    }

    public Optional<TeacherAccountDto> approveTeacher(String uid) {
        return userRepository.findById(uid).map(user -> {
            user.setActive(true);
            userRepository.save(user);
            return convertToTeacherDto(user);
        });
    }

    public TeacherAccountDto updateTeacher(String uid, TeacherAccountDto request) {
        userRepository.findById(uid).ifPresent(user -> {
            user.setDisplayName(request.getDisplayName());
            user.setEmail(request.getEmail());
            user.setRole(request.getRole());
            user.setTeacherId(request.getTeacherId());
            user.setSpecialization(request.getSpecialization());
            user.setActive(request.isActive());
            userRepository.save(user);
        });
        request.setUid(uid);
        return request;
    }

    public void deleteTeacher(String uid) {
        userRepository.deleteById(uid);
    }

    public List<TeacherAccountDto> listTeachers() {
        return userRepository.findAll().stream()
                .filter(u -> "TEACHER".equals(u.getRole()) || "ADMIN".equals(u.getRole()))
                .map(this::convertToTeacherDto)
                .collect(Collectors.toList());
    }

    public List<StudentDto> listStudents() {
        return userRepository.findAll().stream()
                .filter(u -> "LEARNER".equals(u.getRole()))
                .map(u -> new StudentDto(
                        u.getUid(),
                        u.getDisplayName() != null ? u.getDisplayName() : "Unknown",
                        u.getEmail(),
                        u.getLevel() != null ? u.getLevel() : "A1",
                        u.getPlacementTestScore() != null ? u.getPlacementTestScore() * 10 : 0
                ))
                .collect(Collectors.toList());
    }

    public Optional<StudentDto> updateStudentLevel(String uid, String level, Integer score) {
        return userRepository.findById(uid).map(user -> {
            user.setLevel(level);
            user.setPlacementTestScore(score);
            userRepository.save(user);
            return new StudentDto(
                    user.getUid(),
                    user.getDisplayName() != null ? user.getDisplayName() : "Unknown",
                    user.getEmail(),
                    user.getLevel(),
                    user.getPlacementTestScore() != null ? user.getPlacementTestScore() : 0
            );
        });
    }

    public Optional<User> getUserProfile(String uid) {
        return userRepository.findById(uid);
    }

    public Optional<User> updateUserProfile(String uid, User updateReq) {
        return userRepository.findById(uid).map(user -> {
            // ONLY explicitly editable fields (Name, Phone, Photo, Password) without modifying Username or Email!
            if (updateReq.getDisplayName() != null && !updateReq.getDisplayName().isEmpty()) {
                user.setDisplayName(updateReq.getDisplayName());
            }
            if (updateReq.getPhoneNumber() != null) {
                user.setPhoneNumber(updateReq.getPhoneNumber());
            }
            if (updateReq.getPhotoUrl() != null) {
                user.setPhotoUrl(updateReq.getPhotoUrl());
            }
            if (updateReq.getPassword() != null && !updateReq.getPassword().trim().isEmpty()) {
                user.setPassword(passwordEncoder.encode(updateReq.getPassword()));
            }
            return userRepository.save(user);
        });
    }

    // -------- Course Management (17) --------

    public CourseDto createCourse(CourseDto request) {
        String id = request.getId() != null ? request.getId() : "C-" + UUID.randomUUID().toString().substring(0, 8);
        Course course = new Course();
        course.setId(id);
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setLevel(request.getLevel());
        course.setPublished(request.isPublished());
        course.setModuleIds(request.getModuleIds());
        
        course.setTeacherId(request.getTeacherId() != null ? request.getTeacherId() : "T-UNKNOWN");
        course.setPrice(request.getPrice() != null ? request.getPrice() : 0.0);
        course.setRating(request.getRating() != null ? request.getRating() : 0.0);
        course.setTotalStudents(request.getTotalStudents() != null ? request.getTotalStudents() : 0);
        
        courseRepository.save(course);
        request.setId(id);
        return request;
    }

    public Optional<CourseDto> getCourse(String courseId) {
        return courseRepository.findById(courseId).map(this::convertToCourseDto);
    }

    public CourseDto updateCourse(String courseId, CourseDto request) {
        courseRepository.findById(courseId).ifPresent(course -> {
            course.setTitle(request.getTitle());
            course.setDescription(request.getDescription());
            course.setLevel(request.getLevel());
            course.setPublished(request.isPublished());
            course.setModuleIds(request.getModuleIds());
            courseRepository.save(course);
        });
        request.setId(courseId);
        return request;
    }

    public void deleteCourse(String courseId) {
        courseRepository.deleteById(courseId);
    }

    public List<CourseDto> listCourses() {
        return courseRepository.findAll().stream()
                .map(this::convertToCourseDto)
                .collect(Collectors.toList());
    }

    public List<CourseDto> listCoursesByTeacher(String teacherId) {
        return courseRepository.findByTeacherId(teacherId).stream()
                .map(this::convertToCourseDto)
                .collect(Collectors.toList());
    }

    public TeacherStatsDto getTeacherStats(String teacherId) {
        List<Course> courses = courseRepository.findByTeacherId(teacherId);
        int totalCourses = courses.size();
        int totalStudents = 0;
        double sumRating = 0;
        double totalRevenue = 0;
        
        for (Course c : courses) {
            int students = c.getTotalStudents() != null ? c.getTotalStudents() : 0;
            totalStudents += students;
            sumRating += c.getRating() != null ? c.getRating() : 0.0;
            totalRevenue += (c.getPrice() != null ? c.getPrice() : 0.0) * students;
        }
        
        double avgRating = totalCourses > 0 ? (sumRating / totalCourses) : 0.0;
        avgRating = Math.round(avgRating * 10.0) / 10.0;
        
        List<Integer> monthlyViews = Arrays.asList(400, 600, 800, 1200, 2000, 3500, 4800, 6000, 8500, 11000, 15000, 22000); 
        return new TeacherStatsDto(totalCourses, totalStudents, avgRating, totalRevenue, monthlyViews);
    }

    // -------- Notification System (18) --------

    public NotificationDto createNotification(NotificationDto request) {
        String id = request.getId() != null ? request.getId() : "N-" + UUID.randomUUID().toString().substring(0, 8);
        Notification n = new Notification();
        n.setId(id);
        n.setTitle(request.getTitle());
        n.setContent(request.getContent());
        n.setTargetType(request.getTargetType() != null ? request.getTargetType() : "ALL");
        n.setTargetId(request.getTargetId());
        n.setRead(false);
        n.setCreatedAt(request.getCreatedAt() != null ? request.getCreatedAt() : java.time.LocalDateTime.now());
        notificationRepository.save(n);
        request.setId(id);
        return request;
    }

    public List<NotificationDto> listNotificationsForUser(String userId) {
        return notificationRepository.findForUser(userId).stream()
                .map(this::convertToNotificationDto)
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null) return 1;
                    if (b.getCreatedAt() == null) return -1;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .collect(Collectors.toList());
    }

    public void markNotificationAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    // -------- Helper Converters --------

    private TeacherAccountDto convertToTeacherDto(User user) {
        TeacherAccountDto dto = new TeacherAccountDto();
        dto.setUid(user.getUid());
        dto.setEmail(user.getEmail());
        dto.setDisplayName(user.getDisplayName());
        dto.setRole(user.getRole());
        dto.setTeacherId(user.getTeacherId());
        dto.setSpecialization(user.getSpecialization());
        dto.setActive(user.isActive());
        return dto;
    }

    private CourseDto convertToCourseDto(Course course) {
        CourseDto dto = new CourseDto();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setLevel(course.getLevel());
        dto.setPublished(course.isPublished());
        dto.setModuleIds(course.getModuleIds());
        
        dto.setTeacherId(course.getTeacherId());
        dto.setPrice(course.getPrice() != null ? course.getPrice() : 0.0);
        dto.setRating(course.getRating() != null ? course.getRating() : 0.0);
        dto.setTotalStudents(course.getTotalStudents() != null ? course.getTotalStudents() : 0);
        
        return dto;
    }

    private NotificationDto convertToNotificationDto(Notification n) {
        NotificationDto dto = new NotificationDto();
        dto.setId(n.getId());
        dto.setTitle(n.getTitle());
        dto.setContent(n.getContent());
        dto.setTargetType(n.getTargetType());
        dto.setTargetId(n.getTargetId());
        dto.setCreatedAt(n.getCreatedAt());
        dto.setRead(n.isRead());
        return dto;
    }
}
