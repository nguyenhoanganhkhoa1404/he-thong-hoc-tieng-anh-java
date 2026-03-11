# Cấu trúc dự án - English Learning Website

## Tổng quan

Website học tiếng Anh với kiến trúc Front-end + Back-end (RESTful API), sử dụng Firebase làm cơ sở dữ liệu.

Team Leader: Nguyễn Hoàng Anh Khoa - 2280601527
Team Members: Nguyễn Thành Phú - 2280602412
              Huỳnh Phúc Xuân Mai - 2280601885
              Nguyễn Quốc Vượng - 2280603779
              Nguyễn Minh Tiến - 2280603225
              Trần Mỹ Tâm - 2280602849

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

### 3. Nhóm 1 – Auth & User Management (`auth_nhom1`) - Tiến

**Phạm vi**: Đăng ký, đăng nhập, đăng xuất, quản lý hồ sơ người dùng.

- **Front-end (HTML + JS + CSS)**:  
  - Thư mục: `frontend/nhom1-auth/`  
  - File chính: `frontend/nhom1-auth/index.html`, `frontend/nhom1-auth/auth.js`, `frontend/styles.css`
- **Back-end (Spring Boot)**:  
  - Package: `auth_nhom1` (controller, service, dto)  
  - Controller: `AuthController`  
  - Service: `FirebaseAuthService`, `UserService`  
  - DTO: `RegisterRequest`, `TeacherRegisterRequest`, `LoginRequest`, `AuthResponse`

- **Chức năng 1 – User Registration**
  - Đăng ký tài khoản học viên (Learner).
  - Đăng ký tài khoản giáo viên (Teacher) bằng luồng/trang riêng.
  - Sử dụng Firebase Authentication (Email/Password, có thể mở rộng social login).
  - **Front-end**: form đăng ký trong `frontend/nhom1-auth/index.html` + xử lý submit trong `frontend/nhom1-auth/auth.js`.
  - **Back-end**: endpoint `/api/auth/register` (Learner), `/api/auth/teacher/register` (Teacher) trong `AuthController`, dùng `RegisterRequest` / `TeacherRegisterRequest` và `UserService`.

- **Chức năng 2 – User Login / Logout**
  - Đăng nhập bằng email/mật khẩu (Firebase Auth).
  - Xử lý xác thực token (ID Token) giữa front-end và back-end.
  - Đăng xuất (chủ yếu phía front-end, backend hỗ trợ revoke/blacklist nếu cần).
  - **Front-end**: form đăng nhập trong `frontend/nhom1-auth/index.html`, lưu token tạm ở JS trong `auth.js`, xử lý logout phía client.
  - **Back-end**: endpoint `/api/auth/login` trong `AuthController`, dùng `LoginRequest` và trả `AuthResponse` chứa token.

- **Chức năng 3 – User Profile Management**
  - Xem và cập nhật thông tin cá nhân: tên, email (read-only), avatar, số điện thoại.
  - Lưu level tiếng Anh hiện tại (A1, A2, B1, B2, C1, C2).
  - Đồng bộ thông tin cơ bản với Firebase Auth + lưu chi tiết trong Firestore.
  - **Front-end**: phần xem/cập nhật profile trong `frontend/nhom1-auth/index.html`, gọi API `/api/auth/me` và `/api/auth/profile` trong `auth.js`.
  - **Back-end**: xử lý trong `AuthController` + `UserService`, đọc/ghi dữ liệu người dùng trên Firebase.

---

### 4. Nhóm 2 – Placement & Vocabulary & Grammar (`vocabulary_grammar_nhom2`) - Phú

**Phạm vi**: Xác định trình độ, học từ vựng và ngữ pháp.

- **Front-end (HTML + JS + CSS)**:  
  - Thư mục: `frontend/nhom2-vocab-grammar/`  
  - Gợi ý file: `frontend/nhom2-vocab-grammar/index.html`, `frontend/nhom2-vocab-grammar/vocab-grammar.js`, dùng chung `frontend/styles.css`
- **Back-end (Spring Boot)**:  
  - Package: `vocabulary_grammar_nhom2`  
  - Controller: `VocabularyGrammarController`  
  - Service: `VocabularyGrammarService`  
  - DTO: `PlacementTestResultDto`, `VocabularyItemDto`, `GrammarLessonDto`

- **Chức năng 4 – Placement Test**
  - Bài kiểm tra đầu vào (trắc nghiệm, đọc, nghe cơ bản).
  - Tính điểm và gán level (A1–C2) cho người học.
  - Lưu kết quả và level vào Firestore, hiển thị trong profile/progress.
  - **Front-end**: trang làm placement test (câu hỏi trắc nghiệm) trong `frontend/nhom2-vocab-grammar/index.html`, logic chấm điểm & gọi API trong `vocab-grammar.js`.
  - **Back-end**: endpoint placement test trong `VocabularyGrammarController`, xử lý nghiệp vụ trong `VocabularyGrammarService`, trả về `PlacementTestResultDto`.

- **Chức năng 5 – Vocabulary Learning**
  - Học từ vựng theo chủ đề (travel, business, daily life, …).
  - Mỗi từ có: từ, nghĩa, ví dụ, phát âm (link audio nếu có).
  - Tạo API lấy danh sách từ vựng theo chủ đề/level và trạng thái đã học/chưa học.
  - **Front-end**: màn hình danh sách từ vựng, chọn chủ đề/level trong `index.html`, gọi API và render danh sách trong `vocab-grammar.js`.
  - **Back-end**: endpoint trả `VocabularyItemDto` theo chủ đề/level, lưu trạng thái đã học/chưa học trên Firestore.

- **Chức năng 6 – Grammar Lessons**
  - Các bài học ngữ pháp: chủ đề, mô tả, ví dụ, ghi chú.
  - API lấy danh sách bài ngữ pháp theo level/chủ đề.
  - Đánh dấu bài ngữ pháp đã xem/hoàn thành cho từng người dùng.
  - **Front-end**: danh sách bài ngữ pháp và chi tiết bài học trong `index.html`, xử lý gọi API + đánh dấu hoàn thành trong `vocab-grammar.js`.
  - **Back-end**: endpoint trả `GrammarLessonDto` theo level/chủ đề và lưu trạng thái hoàn thành.

---

### 5. Nhóm 3 – Listening & Speaking (`listening_speaking_nhom3`) - Tâm

**Phạm vi**: Luyện nghe, nói, và một phần đọc hiểu.

- **Front-end (HTML + JS + CSS)**:  
  - Thư mục: `frontend/nhom3-listening-speaking/`  
  - Gợi ý file: `frontend/nhom3-listening-speaking/index.html`, `frontend/nhom3-listening-speaking/listening-speaking.js`, dùng chung `frontend/styles.css`
- **Back-end (Spring Boot)**:  
  - Package: `listening_speaking_nhom3`  
  - Controller: `ListeningSpeakingController`  
  - Service: `ListeningSpeakingService`  
  - DTO: `ListeningLessonDto`, `SpeakingExerciseDto`, `ReadingPassageDto`

- **Chức năng 7 – Listening Practice**
  - Bài nghe (audio/video) với transcript và câu hỏi kèm theo.
  - API trả về nội dung bài nghe và câu hỏi trắc nghiệm/điền từ.
  - Lưu kết quả làm bài nghe, số câu đúng/sai.
  - **Front-end**: giao diện chọn bài nghe, play audio/video, hiển thị transcript + câu hỏi trong `index.html`, xử lý gọi API và chấm điểm trong `listening-speaking.js`.
  - **Back-end**: endpoint trả `ListeningLessonDto` + câu hỏi trong `ListeningSpeakingController`, lưu kết quả trong `ListeningSpeakingService`.

- **Chức năng 8 – Speaking Practice**
  - Luyện nói bằng ghi âm (front-end ghi âm, backend nhận file hoặc URL).
  - (Tuỳ chọn) Tích hợp AI/dịch vụ ngoài để chấm điểm phát âm.
  - Lưu lịch sử các bài luyện nói và điểm số/feedback.
  - **Front-end**: giao diện ghi âm / upload file nói trong `index.html`, gửi file/URL tới API trong `listening-speaking.js`.
  - **Back-end**: endpoint nhận audio, (tuỳ chọn) gọi dịch vụ chấm điểm, lưu kết quả thành `SpeakingExerciseDto`.

- **Chức năng 9 – Reading Practice**
  - Các bài đọc hiểu theo level/chủ đề.
  - Câu hỏi kiểm tra độ hiểu (trắc nghiệm, true/false, điền từ).
  - Lưu tiến độ và điểm số cho từng bài đọc.
  - **Front-end**: giao diện bài đọc + câu hỏi trong `index.html`, xử lý câu trả lời và gửi lên API trong `listening-speaking.js`.
  - **Back-end**: endpoint trả `ReadingPassageDto` + câu hỏi, lưu điểm số và tiến độ.

---

### 6. Nhóm 4 – Writing, Quiz & Progress (`reading_writing_quiz_progress_nhom4`) - Mai

**Phạm vi**: Luyện viết, quiz tương tác và theo dõi tiến độ.

- **Front-end (HTML + JS + CSS)**:  
  - Thư mục: `frontend/nhom4-writing-quiz-progress/`  
  - Gợi ý file: `frontend/nhom4-writing-quiz-progress/index.html`, `frontend/nhom4-writing-quiz-progress/writing-quiz-progress.js`, dùng chung `frontend/styles.css`
- **Back-end (Spring Boot)**:  
  - Package: `reading_writing_quiz_progress_nhom4`  
  - Controller: `WritingQuizProgressController`  
  - Service: `WritingQuizProgressService`  
  - DTO: `WritingExerciseDto`, `QuizQuestionDto`, `ProgressOverviewDto`

- **Chức năng 10 – Writing Practice**
  - Bài tập viết câu hoặc đoạn văn.
  - (Tuỳ chọn) Tự động chấm điểm/gợi ý sửa lỗi cơ bản.
  - Lưu bài viết và feedback để người học xem lại.
  - **Front-end**: form nhập bài viết và hiển thị feedback trong `index.html`, xử lý gọi API lưu/chấm bài viết trong `writing-quiz-progress.js`.
  - **Back-end**: endpoint nhận bài viết, (tuỳ chọn) chấm điểm, lưu `WritingExerciseDto`.

- **Chức năng 11 – Interactive Quizzes**
  - Quiz trắc nghiệm cho từng bài/lesson (từ vựng, ngữ pháp, kỹ năng).
  - Nhiều dạng câu hỏi: chọn đáp án, điền từ, kéo thả (do front-end render).
  - Lưu kết quả quiz và thời gian làm bài.
  - **Front-end**: UI quiz (các loại câu hỏi) trong `index.html`, xử lý logic bài quiz trong `writing-quiz-progress.js`.
  - **Back-end**: endpoint trả `QuizQuestionDto`, nhận kết quả và lưu điểm/thời gian.

- **Chức năng 12 – Progress Tracking**
  - Theo dõi số bài đã hoàn thành, điểm trung bình, level hiện tại.
  - Màn hình tổng quan tiến độ theo kỹ năng (listening/speaking/reading/writing).
  - API trả dữ liệu để front-end hiển thị dashboard progress.
  - **Front-end**: màn hình dashboard tiến độ trong `index.html`, gọi API và vẽ biểu đồ/tổng quan trong `writing-quiz-progress.js`.
  - **Back-end**: endpoint tổng hợp dữ liệu và trả `ProgressOverviewDto`.

---

### 7. Nhóm 5 – Achievements, Plan & Forum (`learning_plan_forum_nhom5`) - Vượng

**Phạm vi**: Thành tựu, kế hoạch học tập và diễn đàn.

- **Front-end (HTML + JS + CSS)**:  
  - Thư mục: `frontend/nhom5-plan-forum/`  
  - Gợi ý file: `frontend/nhom5-plan-forum/index.html`, `frontend/nhom5-plan-forum/plan-forum.js`, dùng chung `frontend/styles.css`
- **Back-end (Spring Boot)**:  
  - Package: `learning_plan_forum_nhom5`  
  - Controller: `LearningPlanForumController`  
  - Service: `LearningPlanForumService`  
  - DTO: `AchievementDto`, `DailyPlanDto`, `ForumPostDto`

- **Chức năng 13 – Achievement / Badges System**
  - Huy hiệu khi hoàn thành số bài nhất định, đạt điểm cao, streak ngày học, …
  - API trả danh sách huy hiệu đạt được và huy hiệu có thể mở khoá.
  - Lưu lịch sử thành tựu trong Firestore.
  - **Front-end**: màn hình danh sách huy hiệu, huy hiệu đã mở khoá / chưa mở khoá trong `index.html`, gọi API và render trong `plan-forum.js`.
  - **Back-end**: endpoint trả `AchievementDto` và lưu lịch sử thành tựu.

- **Chức năng 14 – Daily Learning Plan**
  - Gợi ý lộ trình và nhiệm vụ mỗi ngày: số bài cần làm, kỹ năng cần luyện.
  - Cho phép người dùng đánh dấu nhiệm vụ ngày đã hoàn thành.
  - Lưu kế hoạch và trạng thái hoàn thành theo ngày.
  - **Front-end**: UI kế hoạch hằng ngày (list nhiệm vụ, checkbox hoàn thành) trong `index.html`, xử lý cập nhật trạng thái trong `plan-forum.js`.
  - **Back-end**: endpoint đọc/ghi `DailyPlanDto` và trạng thái hoàn thành trong Firestore.

- **Chức năng 15 – Discussion Forum**
  - Diễn đàn theo chủ đề/bài học.
  - Học viên có thể đăng bài, bình luận, trả lời.
  - (Tuỳ chọn) Report bài viết, phân quyền xoá/sửa cho giáo viên/admin.
  - **Front-end**: màn hình diễn đàn (danh sách bài viết, form tạo bài mới, comment) trong `index.html`, xử lý gọi API trong `plan-forum.js`.
  - **Back-end**: endpoint CRUD cho `ForumPostDto`, xử lý quyền sửa/xoá và report trong `LearningPlanForumService`.

---

### 8. Nhóm 6 – Teacher / Admin (`teacher_admin_nhom6`) - Khoa

**Phạm vi**: Quản lý giáo viên, khoá học và thông báo hệ thống.

- **Front-end (HTML + JS + CSS)**:  
  - Thư mục: `frontend/nhom6-teacher-admin/`  
  - Gợi ý file: `frontend/nhom6-teacher-admin/index.html`, `frontend/nhom6-teacher-admin/teacher-admin.js`, dùng chung `frontend/styles.css`
- **Back-end (Spring Boot)**:  
  - Package: `teacher_admin_nhom6`  
  - Controller: `TeacherAdminController`  
  - Service: `TeacherAdminService`  
  - DTO: `TeacherAccountDto`, `CourseDto`, `NotificationDto`

- **Chức năng 16 – Teacher / Admin Management**
  - Quản lý tài khoản giáo viên và admin (tạo/sửa/xoá, phân quyền).
  - Trang đăng ký giáo viên riêng, duyệt tài khoản giáo viên.
  - Phân quyền truy cập vào Teacher/Admin Panel.
  - **Front-end**: màn hình Teacher/Admin Panel trong `index.html` (danh sách tài khoản, form tạo/sửa), xử lý gọi API trong `teacher-admin.js`.
  - **Back-end**: endpoint quản lý tài khoản giáo viên/admin trong `TeacherAdminController`, dùng `TeacherAccountDto`.

- **Chức năng 17 – Course Management**
  - Tạo/sửa/xoá khoá học và bài học (từ vựng, ngữ pháp, kỹ năng, quiz).
  - Sắp xếp cấu trúc khoá học: modules, lessons, units.
  - Gán bài học cho level hoặc nhóm người học.
  - **Front-end**: UI quản lý khoá học (bảng, form) trong `index.html`, logic xử lý trong `teacher-admin.js`.
  - **Back-end**: endpoint CRUD khoá học/bài học sử dụng `CourseDto`.

- **Chức năng 18 – Notification System**
  - Gửi thông báo nhắc học bài, thông báo điểm, cập nhật khoá học.
  - Hỗ trợ thông báo theo user, theo lớp/khoá, hoặc toàn hệ thống.
  - Lưu lịch sử thông báo và trạng thái đã đọc/chưa đọc.
  - **Front-end**: màn hình tạo và xem thông báo trong `index.html`, gửi request trong `teacher-admin.js`.
  - **Back-end**: endpoint gửi/lưu thông báo sử dụng `NotificationDto`.

---

### 9. Gợi ý cho từng thành viên/nhóm

- **Mỗi nhóm** nên:
  - Thiết kế model/DTO, controller, service riêng trong thư mục của nhóm.
  - Thống nhất cách lưu dữ liệu trên Firebase (tên collection, field).
  - Viết tài liệu ngắn (.md) trong thư mục nhóm mô tả API mình làm.

---

### 10. Kế hoạch tích hợp Firebase / Firestore (sau khi code xong API + Front-end)

Sau khi **tất cả nhóm** đã hoàn thành phần:

- **Back-end**: API trong các package `auth_nhom1`, `vocabulary_grammar_nhom2`, `listening_speaking_nhom3`, `reading_writing_quiz_progress_nhom4`, `learning_plan_forum_nhom5`, `teacher_admin_nhom6`.  
- **Front-end**: HTML + JS tương ứng trong `frontend/nhom1-auth/` … `frontend/nhom6-teacher-admin/`.  

thì sẽ thực hiện bước **tích hợp Firebase / Firestore** theo thứ tự:

1. **Hoàn thiện cấu hình Firebase chung**  
   - File: `config/FirebaseConfig.java` (đảm bảo dùng đúng `firebase-service-account.json`, `firebase.project-id` trong `application.properties`).  
   - Viết helper/service dùng chung để lấy instance Firestore/Storage (nếu cần).

2. **Gắn từng chức năng với Firestore/Firebase**  
   - `auth_nhom1`: dùng Firebase Authentication + Firestore lưu thông tin chi tiết user (learner/teacher/admin), level, profile.  
   - `vocabulary_grammar_nhom2`: thiết kế collection cho placement test, vocabulary, grammar lessons.  
   - `listening_speaking_nhom3`: thiết kế collection cho bài nghe, bài nói, kết quả làm bài.  
   - `reading_writing_quiz_progress_nhom4`: thiết kế collection cho bài viết, quiz, thống kê tiến độ.  
   - `learning_plan_forum_nhom5`: collection cho achievements, daily plans, forum posts.  
   - `teacher_admin_nhom6`: collection cho teacher/admin accounts, courses, notifications.

3. **Cập nhật tài liệu chi tiết về Firestore**  
   - Bổ sung vào `README.md` (hoặc tạo file `docs/firestore-schema.md`) mô tả:  
     - Tên collection, ví dụ: `users`, `courses`, `quizzes`, `forum_posts`, `achievements`, …  
     - Cấu trúc document (các field chính, kiểu dữ liệu, ví dụ JSON).  
     - Endpoint nào đọc/ghi vào collection/document nào.

Khi tới giai đoạn này, toàn bộ API + front-end đã sẵn sàng, việc tích hợp Firebase/Firestore sẽ chỉ cần cập nhật logic trong service và bổ sung tài liệu, không ảnh hưởng lớn đến cấu trúc hiện tại.