package com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.service;

import com.englishwebsite.EnglishWebsite.model.*;
import com.englishwebsite.EnglishWebsite.repository.*;
import com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto.*;
import com.englishwebsite.EnglishWebsite.service.AchievementService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.firestore.*;
import com.google.api.core.ApiFuture;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;
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
    private final TestSetRepository testSetRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final Firestore firestore;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;
    private final AchievementService achievementService;

    public TeacherAdminService(UserRepository userRepository,
                               CourseRepository courseRepository,
                               NotificationRepository notificationRepository,
                               TestSetRepository testSetRepository,
                               QuizQuestionRepository quizQuestionRepository,
                               Firestore firestore,
                               org.springframework.security.crypto.password.PasswordEncoder passwordEncoder,
                               ObjectMapper objectMapper,
                               AchievementService achievementService) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.notificationRepository = notificationRepository;
        this.testSetRepository = testSetRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.firestore = firestore;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = objectMapper;
        this.achievementService = achievementService;
    }

    // -------- Teacher / Admin Management (16) --------

    public TeacherAccountDto createTeacher(TeacherAccountDto request) {
        String uid = request.getUid() != null ? request.getUid() : "T-" + UUID.randomUUID().toString().substring(0, 8);
        request.setUid(uid);
        
        // Firestore Sync
        firestore.collection("users").document(uid).set(request);

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
            TeacherAccountDto dto = convertToTeacherDto(user);
            // Firestore Sync
            firestore.collection("users").document(uid).update("active", true);
            return dto;
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
        // Firestore Sync
        firestore.collection("users").document(uid).set(request);
        return request;
    }

    public void deleteTeacher(String uid) {
        userRepository.deleteById(uid);
        // Firestore Sync
        firestore.collection("users").document(uid).delete();
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
        request.setId(id);
        
        // Save to Firestore
        firestore.collection("courses").document(id).set(request);

        // Save to MySQL (Legacy/Sync)
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
        
        // Achievement Check
        int courseCount = courseRepository.findByTeacherId(course.getTeacherId()).size();
        int testCount = testSetRepository.findByTeacherId(course.getTeacherId()).size();
        achievementService.checkAndAwardTeacherAchievements(course.getTeacherId(), courseCount, testCount);
        
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
            if (request.getTotalStudents() != null) {
                course.setTotalStudents(request.getTotalStudents());
            }
            courseRepository.save(course);
        });
        request.setId(courseId);
        // Firestore Sync
        firestore.collection("courses").document(courseId).set(request);
        return request;
    }

    public void deleteCourse(String courseId) {
        courseRepository.deleteById(courseId);
        // Firestore Sync
        firestore.collection("courses").document(courseId).delete();
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
        request.setId(id);
        request.setCreatedAt(request.getCreatedAt() != null ? request.getCreatedAt() : java.time.LocalDateTime.now());
        
        // Save to Firestore
        firestore.collection("notifications").document(id).set(request);

        // Save to MySQL
        Notification n = new Notification();
        n.setId(id);
        n.setTitle(request.getTitle());
        n.setContent(request.getContent());
        n.setTargetType(request.getTargetType() != null ? request.getTargetType() : "ALL");
        n.setTargetId(request.getTargetId());
        n.setRead(false);
        n.setCreatedAt(request.getCreatedAt());
        notificationRepository.save(n);
        
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

    // -------- Test Set Management (Nhóm 6: Khoa) --------

    public TestSetDto createTestSet(TestSetDto request) {
        String id = request.getId() != null ? request.getId() : "TS-" + UUID.randomUUID().toString().substring(0, 8);
        request.setId(id);
        
        // Firestore Sync
        firestore.collection("test_sets").document(id).set(request);

        TestSet ts = new TestSet();
        ts.setId(id);
        ts.setName(request.getName());
        ts.setType(request.getType());
        ts.setDuration(request.getDuration());
        ts.setLevel(request.getLevel());
        ts.setDescription(request.getDescription());
        ts.setTeacherId(request.getTeacherId());
        testSetRepository.save(ts);
        
        // Achievement Check
        int courseCount = courseRepository.findByTeacherId(ts.getTeacherId()).size();
        int testCount = testSetRepository.findByTeacherId(ts.getTeacherId()).size();
        achievementService.checkAndAwardTeacherAchievements(ts.getTeacherId(), courseCount, testCount);
        
        return request;
    }

    public List<TestSetDto> listTestSetsByTeacher(String teacherId) {
        return testSetRepository.findByTeacherId(teacherId).stream()
                .map(this::convertToTestSetDto)
                .collect(Collectors.toList());
    }

    public Optional<TestSetDto> getTestSet(String id) {
        return testSetRepository.findById(id).map(ts -> {
            TestSetDto dto = convertToTestSetDto(ts);
            dto.setQuestions(quizQuestionRepository.findByTestSetId(id).stream()
                    .map(this::convertToQuizQuestionDto)
                    .collect(Collectors.toList()));
            return dto;
        });
    }

    public TestSetDto updateTestSet(String id, TestSetDto request) {
        testSetRepository.findById(id).ifPresent(ts -> {
            ts.setName(request.getName());
            ts.setType(request.getType());
            ts.setDuration(request.getDuration());
            ts.setLevel(request.getLevel());
            ts.setDescription(request.getDescription());
            testSetRepository.save(ts);
        });
        request.setId(id);
        // Firestore Sync
        firestore.collection("test_sets").document(id).set(request);
        return request;
    }

    public void deleteTestSet(String id) {
        // Delete associated questions first? Usually JPA cascade or manual
        List<QuizQuestion> questions = quizQuestionRepository.findByTestSetId(id);
        quizQuestionRepository.deleteAll(questions);
        testSetRepository.deleteById(id);
        // Firestore Sync
        firestore.collection("test_sets").document(id).delete();
        // Note: In Firestore, we might also want to delete the subcollection or questions in another collection
    }

    public QuizQuestionDto saveQuestionToTestSet(String testSetId, QuizQuestionDto request) {
        String id = request.getId() != null ? request.getId() : "QZ-" + UUID.randomUUID().toString().substring(0, 8);
        request.setId(id);
        request.setTestSetId(testSetId);

        // Firestore Sync
        firestore.collection("test_sets").document(testSetId)
                .collection("questions").document(id).set(request);

        QuizQuestion q = quizQuestionRepository.findById(id).orElse(new QuizQuestion());
        q.setId(id);
        q.setTestSetId(testSetId);
        q.setType(request.getType());
        q.setQuestionText(request.getQuestionText());
        q.setCorrectAnswer(request.getCorrectAnswer());
        q.setExplanation(request.getExplanation());
        q.setOrder(request.getOrder());
        q.setDifficultyLevel(request.getDifficultyLevel());

        try {
            if (request.getOptions() != null) {
                q.setOptionsJson(objectMapper.writeValueAsString(request.getOptions()));
            }
            if (request.getCorrectAnswers() != null) {
                q.setCorrectAnswersJson(objectMapper.writeValueAsString(request.getCorrectAnswers()));
            }
        } catch (JsonProcessingException e) {
            // Log error
        }

        quizQuestionRepository.save(q);
        return request;
    }

    public List<QuizQuestionDto> listQuestionsByTestSet(String testSetId) {
        return quizQuestionRepository.findByTestSetId(testSetId).stream()
                .map(this::convertToQuizQuestionDto)
                .collect(Collectors.toList());
    }

    public void deleteQuestion(String questionId) {
        Optional<QuizQuestion> q = quizQuestionRepository.findById(questionId);
        if (q.isPresent()) {
            String testSetId = q.get().getTestSetId();
            quizQuestionRepository.deleteById(questionId);
            // Firestore Sync
            firestore.collection("test_sets").document(testSetId)
                    .collection("questions").document(questionId).delete();
        }
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

    private TestSetDto convertToTestSetDto(TestSet ts) {
        TestSetDto dto = new TestSetDto();
        dto.setId(ts.getId());
        dto.setName(ts.getName());
        dto.setType(ts.getType());
        dto.setDuration(ts.getDuration());
        dto.setLevel(ts.getLevel());
        dto.setDescription(ts.getDescription());
        dto.setTeacherId(ts.getTeacherId());
        return dto;
    }

    private QuizQuestionDto convertToQuizQuestionDto(QuizQuestion q) {
        QuizQuestionDto dto = new QuizQuestionDto();
        dto.setId(q.getId());
        dto.setLessonId(q.getLessonId());
        dto.setTestSetId(q.getTestSetId());
        dto.setType(q.getType());
        dto.setQuestionText(q.getQuestionText());
        dto.setCorrectAnswer(q.getCorrectAnswer());
        dto.setExplanation(q.getExplanation());
        dto.setOrder(q.getOrder());
        dto.setDifficultyLevel(q.getDifficultyLevel());

        try {
            if (q.getOptionsJson() != null && !q.getOptionsJson().isEmpty()) {
                dto.setOptions(objectMapper.readValue(q.getOptionsJson(), new TypeReference<List<String>>() {}));
            }
            if (q.getCorrectAnswersJson() != null && !q.getCorrectAnswersJson().isEmpty()) {
                dto.setCorrectAnswers(objectMapper.readValue(q.getCorrectAnswersJson(), new TypeReference<List<String>>() {}));
            }
        } catch (JsonProcessingException e) {
            // Log error
        }
        return dto;
    }
}
