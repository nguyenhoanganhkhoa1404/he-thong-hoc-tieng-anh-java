# Cấu trúc dự án - English Learning Website

## Tổng quan

Website học tiếng Anh với kiến trúc Front-end + Back-end (RESTful API), sử dụng Firebase làm cơ sở dữ liệu.

## Cấu trúc thư mục

### Back-end (Spring Boot)

```
src/main/java/com/englishwebsite/EnglishWebsite/
├── config/                                  # Cấu hình chung
│   ├── FirebaseConfig.java                 # Cấu hình Firebase
│   └── CorsConfig.java                     # Cấu hình CORS cho front-end
│
├── model/                                   # Models dùng chung
│   ├── User.java                           # Model User (Learner/Teacher/Admin)
│   └── UserRole.java                       # Enum vai trò người dùng
│
├── auth_nhom1/                              # Nhóm 1: Auth & User Management
│   ├── controller/
│   │   └── AuthController.java             # API đăng ký / đăng nhập / profile
│   ├── service/
│   │   ├── FirebaseAuthService.java        # Làm việc với Firebase Auth
│   │   └── UserService.java                # Nghiệp vụ người dùng
│   └── dto/
│       ├── LoginRequest.java               # DTO đăng nhập
│       ├── RegisterRequest.java            # DTO đăng ký Learner
│       ├── TeacherRegisterRequest.java     # DTO đăng ký Teacher (trang riêng)
│       └── AuthResponse.java               # DTO response Auth
│   # Chức năng nhóm 1:
│   # 1. User Registration
│   # 2. User Login / Logout
│   # 3. User Profile Management
│
├── vocabulary_grammar_nhom2/                # Nhóm 2: Placement & Vocabulary & Grammar
│   # Gợi ý cấu trúc:
│   ├── controller/
│   │   └── VocabularyGrammarController.java   # API Placement Test, Vocabulary, Grammar
│   ├── service/
│   │   └── VocabularyGrammarService.java      # Nghiệp vụ cho từ vựng & ngữ pháp
│   └── dto/
│       ├── PlacementTestResultDto.java        # Kết quả Placement Test
│       ├── VocabularyItemDto.java             # Từ vựng theo chủ đề
│       └── GrammarLessonDto.java              # Bài học ngữ pháp
│   # Chức năng nhóm 2:
│   # 4. Placement Test
│   # 5. Vocabulary Learning
│   # 6. Grammar Lessons
│
├── listening_speaking_nhom3/                # Nhóm 3: Listening & Speaking
│   ├── controller/
│   │   └── ListeningSpeakingController.java  # API Listening, Speaking, Reading practice
│   ├── service/
│   │   └── ListeningSpeakingService.java     # Nghiệp vụ nghe/nói/đọc
│   └── dto/
│       ├── ListeningLessonDto.java           # Bài nghe
│       ├── SpeakingExerciseDto.java          # Bài nói
│       └── ReadingPassageDto.java            # Bài đọc
│   # Chức năng nhóm 3:
│   # 7. Listening Practice
│   # 8. Speaking Practice
│   # 9. Reading Practice
│
├── reading_writing_quiz_progress_nhom4/     # Nhóm 4: Writing, Quiz & Progress
│   ├── controller/
│   │   └── WritingQuizProgressController.java  # API viết, quiz, tiến độ
│   ├── service/
│   │   └── WritingQuizProgressService.java     # Nghiệp vụ viết/quiz/tiến độ
│   └── dto/
│       ├── WritingExerciseDto.java             # Bài viết
│       ├── QuizQuestionDto.java                # Câu hỏi quiz
│       └── ProgressOverviewDto.java            # Tổng quan tiến độ
│   # Chức năng nhóm 4:
│   # 10. Writing Practice
│   # 11. Interactive Quizzes
│   # 12. Progress Tracking
│
├── learning_plan_forum_nhom5/               # Nhóm 5: Achievements, Plan & Forum
│   ├── controller/
│   │   └── LearningPlanForumController.java   # API huy hiệu, kế hoạch, diễn đàn
│   ├── service/
│   │   └── LearningPlanForumService.java      # Nghiệp vụ liên quan nhóm 5
│   └── dto/
│       ├── AchievementDto.java                # Huy hiệu / thành tựu
│       ├── DailyPlanDto.java                  # Kế hoạch học mỗi ngày
│       └── ForumPostDto.java                  # Bài viết diễn đàn
│   # Chức năng nhóm 5:
│   # 13. Achievement / Badges System
│   # 14. Daily Learning Plan
│   # 15. Discussion Forum
│
└── teacher_admin_nhom6/                     # Nhóm 6: Teacher / Admin
    ├── controller/
    │   └── TeacherAdminController.java       # API quản lý giáo viên/admin, khoá học, thông báo
    ├── service/
    │   └── TeacherAdminService.java          # Nghiệp vụ quản trị
    └── dto/
        ├── TeacherAccountDto.java            # Thông tin giáo viên/admin
        ├── CourseDto.java                    # Khóa học / bài học
        └── NotificationDto.java              # Thông báo
    # Chức năng nhóm 6:
    # 16. Teacher / Admin Management
    # 17. Course Management
    # 18. Notification System
```

## Vai trò người dùng

### 1. Learner (Học viên)
- Đăng ký qua `/api/auth/register`
- Sử dụng các chức năng học tập
- Xem tiến độ, thành tích

### 2. Teacher (Giáo viên)
- Đăng ký qua `/api/auth/teacher/register` (trang riêng)
- Quản lý khóa học, nội dung
- Xem thống kê học viên

## API Endpoints (Nhóm 1 - Auth)

### Đăng ký học viên
```
POST /api/auth/register
Body: {
  "email": "learner@example.com",
  "password": "password123",
  "displayName": "Nguyễn Văn A",
  "phoneNumber": "0123456789"
}
```

### Đăng ký giáo viên
```
POST /api/auth/teacher/register
Body: {
  "email": "teacher@example.com",
  "password": "password123",
  "displayName": "Giáo viên B",
  "teacherId": "T001",
  "specialization": "Grammar"
}
```

### Đăng nhập
```
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}
```

### Verify Token
```
POST /api/auth/verify
Headers: {
  "Authorization": "Bearer <firebase-id-token>"
}
```

### Lấy thông tin user hiện tại
```
GET /api/auth/me
Headers: {
  "Authorization": "Bearer <firebase-id-token>"
}
```

### Cập nhật profile
```
PUT /api/auth/profile
Headers: {
  "Authorization": "Bearer <firebase-id-token>"
}
Body: {
  "displayName": "Tên mới",
  "phoneNumber": "0987654321"
}
```

## Cấu hình

### application.properties
```properties
spring.application.name=EnglishWebsite
server.port=8080

firebase.project-id=your-firebase-project-id
firebase.credentials.path=classpath:firebase-service-account.json

cors.allowed-origins=http://localhost:3000,http://localhost:4200
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
cors.allow-credentials=true
```

## Firebase Setup

Xem file `FIREBASE_SETUP.md` để biết cách cấu hình Firebase.

## Tasks per Group – English Learning Website

### 1. Project Overview

- **Tên**: Website học tiếng Anh (English Learning Website)  
- **Kiến trúc**: Front-end + Back-end (RESTful API)  
- **Cơ sở dữ liệu**: **Firebase**  
  - Authentication  
  - Firestore hoặc Realtime Database  
  - Storage (nếu cần)  
- **Dữ liệu học**: từ vựng, ngữ pháp, nghe, nói, đọc, viết, quiz… đã có sẵn trên Firebase; backend chỉ cần đọc/ghi theo thiết kế API.

### 2. Vai trò người dùng (tóm tắt)

- **Learner (Học viên)**  
  - Đăng ký / đăng nhập  
  - Học từ vựng, ngữ pháp, kỹ năng 4 kỹ năng  
  - Làm quiz, theo dõi tiến độ, nhận thành tựu  
  - Tham gia diễn đàn, theo kế hoạch học tập

- **Teacher (Giáo viên)**  
  - Đăng ký qua **trang/luồng riêng** (không dùng chung đăng ký học viên)  
  - Quản lý khóa học, bài học, người dùng  
  - Gửi thông báo, theo dõi kết quả học viên

---

### 3. Nhóm 1 – Auth & User Management (`auth_nhom1`)

**Phạm vi**: Đăng ký, đăng nhập, đăng xuất, quản lý hồ sơ người dùng.

- **Chức năng 1 – User Registration**
  - Đăng ký tài khoản học viên (Learner).
  - Đăng ký tài khoản giáo viên (Teacher) bằng luồng/trang riêng.
  - Sử dụng Firebase Authentication (Email/Password, có thể mở rộng social login).

- **Chức năng 2 – User Login / Logout**
  - Đăng nhập bằng email/mật khẩu (Firebase Auth).
  - Xử lý xác thực token (ID Token) giữa front-end và back-end.
  - Đăng xuất (chủ yếu phía front-end, backend hỗ trợ revoke/blacklist nếu cần).

- **Chức năng 3 – User Profile Management**
  - Xem và cập nhật thông tin cá nhân: tên, email (read-only), avatar, số điện thoại.
  - Lưu level tiếng Anh hiện tại (A1, A2, B1, B2, C1, C2).
  - Đồng bộ thông tin cơ bản với Firebase Auth + lưu chi tiết trong Firestore.

---

### 4. Nhóm 2 – Placement & Vocabulary & Grammar (`vocabulary_grammar_nhom2`)

**Phạm vi**: Xác định trình độ, học từ vựng và ngữ pháp.

- **Chức năng 4 – Placement Test**
  - Bài kiểm tra đầu vào (trắc nghiệm, đọc, nghe cơ bản).
  - Tính điểm và gán level (A1–C2) cho người học.
  - Lưu kết quả và level vào Firestore, hiển thị trong profile/progress.

- **Chức năng 5 – Vocabulary Learning**
  - Học từ vựng theo chủ đề (travel, business, daily life, …).
  - Mỗi từ có: từ, nghĩa, ví dụ, phát âm (link audio nếu có).
  - Tạo API lấy danh sách từ vựng theo chủ đề/level và trạng thái đã học/chưa học.

- **Chức năng 6 – Grammar Lessons**
  - Các bài học ngữ pháp: chủ đề, mô tả, ví dụ, ghi chú.
  - API lấy danh sách bài ngữ pháp theo level/chủ đề.
  - Đánh dấu bài ngữ pháp đã xem/hoàn thành cho từng người dùng.

---

### 5. Nhóm 3 – Listening & Speaking (`listening_speaking_nhom3`)

**Phạm vi**: Luyện nghe, nói, và một phần đọc hiểu.

- **Chức năng 7 – Listening Practice**
  - Bài nghe (audio/video) với transcript và câu hỏi kèm theo.
  - API trả về nội dung bài nghe và câu hỏi trắc nghiệm/điền từ.
  - Lưu kết quả làm bài nghe, số câu đúng/sai.

- **Chức năng 8 – Speaking Practice**
  - Luyện nói bằng ghi âm (front-end ghi âm, backend nhận file hoặc URL).
  - (Tuỳ chọn) Tích hợp AI/dịch vụ ngoài để chấm điểm phát âm.
  - Lưu lịch sử các bài luyện nói và điểm số/feedback.

- **Chức năng 9 – Reading Practice**
  - Các bài đọc hiểu theo level/chủ đề.
  - Câu hỏi kiểm tra độ hiểu (trắc nghiệm, true/false, điền từ).
  - Lưu tiến độ và điểm số cho từng bài đọc.

---

### 6. Nhóm 4 – Writing, Quiz & Progress (`reading_writing_quiz_progress_nhom4`)

**Phạm vi**: Luyện viết, quiz tương tác và theo dõi tiến độ.

- **Chức năng 10 – Writing Practice**
  - Bài tập viết câu hoặc đoạn văn.
  - (Tuỳ chọn) Tự động chấm điểm/gợi ý sửa lỗi cơ bản.
  - Lưu bài viết và feedback để người học xem lại.

- **Chức năng 11 – Interactive Quizzes**
  - Quiz trắc nghiệm cho từng bài/lesson (từ vựng, ngữ pháp, kỹ năng).
  - Nhiều dạng câu hỏi: chọn đáp án, điền từ, kéo thả (do front-end render).
  - Lưu kết quả quiz và thời gian làm bài.

- **Chức năng 12 – Progress Tracking**
  - Theo dõi số bài đã hoàn thành, điểm trung bình, level hiện tại.
  - Màn hình tổng quan tiến độ theo kỹ năng (listening/speaking/reading/writing).
  - API trả dữ liệu để front-end hiển thị dashboard progress.

---

### 7. Nhóm 5 – Achievements, Plan & Forum (`learning_plan_forum_nhom5`)

**Phạm vi**: Thành tựu, kế hoạch học tập và diễn đàn.

- **Chức năng 13 – Achievement / Badges System**
  - Huy hiệu khi hoàn thành số bài nhất định, đạt điểm cao, streak ngày học, …
  - API trả danh sách huy hiệu đạt được và huy hiệu có thể mở khoá.
  - Lưu lịch sử thành tựu trong Firestore.

- **Chức năng 14 – Daily Learning Plan**
  - Gợi ý lộ trình và nhiệm vụ mỗi ngày: số bài cần làm, kỹ năng cần luyện.
  - Cho phép người dùng đánh dấu nhiệm vụ ngày đã hoàn thành.
  - Lưu kế hoạch và trạng thái hoàn thành theo ngày.

- **Chức năng 15 – Discussion Forum**
  - Diễn đàn theo chủ đề/bài học.
  - Học viên có thể đăng bài, bình luận, trả lời.
  - (Tuỳ chọn) Report bài viết, phân quyền xoá/sửa cho giáo viên/admin.

---

### 8. Nhóm 6 – Teacher / Admin (`teacher_admin_nhom6`)

**Phạm vi**: Quản lý giáo viên, khoá học và thông báo hệ thống.

- **Chức năng 16 – Teacher / Admin Management**
  - Quản lý tài khoản giáo viên và admin (tạo/sửa/xoá, phân quyền).
  - Trang đăng ký giáo viên riêng, duyệt tài khoản giáo viên.
  - Phân quyền truy cập vào Teacher/Admin Panel.

- **Chức năng 17 – Course Management**
  - Tạo/sửa/xoá khoá học và bài học (từ vựng, ngữ pháp, kỹ năng, quiz).
  - Sắp xếp cấu trúc khoá học: modules, lessons, units.
  - Gán bài học cho level hoặc nhóm người học.

- **Chức năng 18 – Notification System**
  - Gửi thông báo nhắc học bài, thông báo điểm, cập nhật khoá học.
  - Hỗ trợ thông báo theo user, theo lớp/khoá, hoặc toàn hệ thống.
  - Lưu lịch sử thông báo và trạng thái đã đọc/chưa đọc.

---

### 9. Gợi ý cho từng thành viên/nhóm

- **Mỗi nhóm** nên:
  - Thiết kế model/DTO, controller, service riêng trong thư mục của nhóm.
  - Thống nhất cách lưu dữ liệu trên Firebase (tên collection, field).
  - Viết tài liệu ngắn (.md) trong thư mục nhóm mô tả API mình làm.
