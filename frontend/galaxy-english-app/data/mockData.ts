// ===== Mock Data for all 6 feature groups =====
import type {
  User, Course, VocabItem, GrammarLesson, ListeningExercise,
  QuizQuestion, ForumPost, LearningPlan, LeaderboardEntry, TeacherStats
} from "@/types";

// ===== Users =====
export const mockUsers: User[] = [
  { id: "u1", email: "student@demo.com", displayName: "Nguyễn Văn An", role: "LEARNER", level: "B1", xp: 4200, streak: 12, photoUrl: "" },
  { id: "u2", email: "teacher@demo.com", displayName: "Trần Thị Mai", role: "TEACHER", xp: 12000, streak: 45, photoUrl: "" },
  { id: "u3", email: "admin@demo.com", displayName: "Admin System", role: "ADMIN", photoUrl: "" },
];

// ===== Nhóm 2: Vocabulary =====
export const mockVocab: VocabItem[] = [
  { id: "v1", word: "Hello", phonetic: "/həˈloʊ/", type: "phrase", meaning: "Xin chào", example: "Hello, how are you?", level: "A1", topic: "Greetings" },
  { id: "v2", word: "Family", phonetic: "/ˈfæmɪli/", type: "noun", meaning: "Gia đình", example: "My family has five members.", level: "A1", topic: "Family" },
  { id: "v3", word: "Study", phonetic: "/ˈstʌdi/", type: "verb", meaning: "Học tập, nghiên cứu", example: "I study English every day.", level: "A1", topic: "Education" },
  { id: "v4", word: "Journey", phonetic: "/ˈdʒɜːrni/", type: "noun", meaning: "Hành trình, chuyến đi", example: "The journey took three hours.", level: "A2", topic: "Travel" },
  { id: "v5", word: "Achievement", phonetic: "/əˈtʃiːvmənt/", type: "noun", meaning: "Thành tích, thành tựu", example: "Learning a language is a great achievement.", level: "B1", topic: "Success" },
  { id: "v6", word: "Perseverance", phonetic: "/pɜːrsɪˈvɪərəns/", type: "noun", meaning: "Sự kiên trì, bền bỉ", example: "Success requires perseverance.", level: "C1", topic: "Character" },
  { id: "v7", word: "Eloquent", phonetic: "/ˈelɪkwənt/", type: "adjective", meaning: "Hùng hồn, lưu loát", example: "She gave an eloquent speech.", level: "C1", topic: "Communication" },
  { id: "v8", word: "Ephemeral", phonetic: "/ɪˈfemərəl/", type: "adjective", meaning: "Phù du, thoáng qua", example: "Youth is ephemeral.", level: "C2", topic: "Philosophy" },
  { id: "v9", word: "Accomplish", phonetic: "/əˈkʌmplɪʃ/", type: "verb", meaning: "Hoàn thành, đạt được", example: "She accomplished her goal.", level: "B1", topic: "Success" },
  { id: "v10", word: "Substantial", phonetic: "/səbˈstænʃl/", type: "adjective", meaning: "Đáng kể, lớn", example: "There was a substantial improvement.", level: "B2", topic: "General" },
  { id: "v11", word: "Phenomenon", phonetic: "/fɪˈnɒmɪnɒn/", type: "noun", meaning: "Hiện tượng", example: "This is a global phenomenon.", level: "B2", topic: "Science" },
  { id: "v12", word: "Nuance", phonetic: "/ˈnjuːɑːns/", type: "noun", meaning: "Sắc thái, chi tiết nhỏ", example: "Language has many nuances.", level: "C1", topic: "Language" },
];

export const vocabByLevel = {
  A1: mockVocab.filter(v => v.level === "A1"),
  A2: mockVocab.filter(v => v.level === "A2"),
  B1: mockVocab.filter(v => v.level === "B1"),
  B2: mockVocab.filter(v => v.level === "B2"),
  C1: mockVocab.filter(v => v.level === "C1"),
  C2: mockVocab.filter(v => v.level === "C2"),
};

// ===== Nhóm 2: Grammar =====
export const mockGrammar: GrammarLesson[] = [
  {
    id: "g1", title: "Present Simple Tense", level: "A1",
    description: "Learn how to talk about habits, facts, and routines.",
    content: "The Present Simple is used for habits, routines, facts, and general truths. Form: Subject + base verb (+ s/es for he/she/it).",
    examples: ["I go to school every day.", "She speaks English well.", "The sun rises in the east."],
    exercises: [
      { id: "e1", question: `She ___ (go) to school every day.`, options: ["go", "goes", "going", "went"], correctAnswer: 1, explanation: "He/she/it takes -es/-s form" },
      { id: "e2", question: `They ___ (play) tennis on weekends.`, options: ["plays", "play", "playing", "played"], correctAnswer: 1, explanation: "They takes base form" },
    ]
  },
  {
    id: "g2", title: "Present Perfect", level: "B1",
    description: "Express actions that happened at an unspecified time before now.",
    content: "Form: have/has + past participle. Used for: recent actions, life experience, unfinished time periods.",
    examples: ["I have visited Japan twice.", "She has just finished her homework.", "Have you ever eaten sushi?"],
    exercises: [
      { id: "e3", question: `I ___ to Japan twice.`, options: ["go", "went", "have been", "am going"], correctAnswer: 2, explanation: "Experience → Present Perfect" },
    ]
  },
  {
    id: "g3", title: "Conditional Sentences Type 1", level: "B1",
    description: "Real conditions and their probable results.",
    content: "Form: If + present simple, will + base verb. Used for real, possible future conditions.",
    examples: ["If it rains, I will stay home.", "If you study hard, you will pass the exam."],
    exercises: [
      { id: "e4", question: `If it ___ tomorrow, we will cancel the trip.`, options: ["rain", "rains", "rained", "will rain"], correctAnswer: 1, explanation: "Present simple in the if-clause" },
    ]
  },
];

// ===== Nhóm 3: Listening =====
export const mockListening: ListeningExercise[] = [
  {
    id: "l1", title: "A Day in the Life", level: "A1",
    audioUrl: "/audio/day-in-life.mp3", duration: 120,
    transcript: "Hi! My name is Sarah. Every morning I wake up at 7am. I have breakfast with my family...",
    questions: [
      { id: "q1", question: "What time does Sarah wake up?", options: ["6am", "7am", "8am", "9am"], correctAnswer: 1 },
      { id: "q2", question: "Who does she have breakfast with?", options: ["Friends", "Colleagues", "Family", "Alone"], correctAnswer: 2 },
    ]
  },
  {
    id: "l2", title: "Climate Change Discussion", level: "B2",
    audioUrl: "/audio/climate.mp3", duration: 240,
    transcript: "Today we're discussing the impact of climate change on global ecosystems...",
    questions: [
      { id: "q3", question: "What is the main topic?", options: ["Weather", "Climate Change", "Animals", "Plants"], correctAnswer: 1 },
    ]
  },
];

// ===== Nhóm 4: Quiz =====
export const mockQuizQuestions: QuizQuestion[] = [
  { id: "q1", question: `She ___ to school every day.`, options: ["go", "goes", "going", "went"], correctAnswer: 1, category: "Grammar", level: "A1" },
  { id: "q2", question: `Which sentence is grammatically correct?`, options: ["I am go home", "I goes home", "I go home", "I going home"], correctAnswer: 2, category: "Grammar", level: "A1" },
  { id: "q3", question: `"Persistent" means:`, options: ["Lazy", "Continuing firmly", "Happy", "Confused"], correctAnswer: 1, category: "Vocabulary", level: "B1" },
  { id: "q4", question: `If it ___ tomorrow, we'll stay indoors.`, options: ["rain", "rains", "rained", "will rain"], correctAnswer: 1, category: "Grammar", level: "B1" },
  { id: "q5", question: `I ___ to Japan twice in my life.`, options: ["go", "went", "have been", "am going"], correctAnswer: 2, category: "Grammar", level: "B1" },
  { id: "q6", question: `Which word is a synonym for "large"?`, options: ["tiny", "small", "enormous", "narrow"], correctAnswer: 2, category: "Vocabulary", level: "A2" },
  { id: "q7", question: `They ___ football when it started raining.`, options: ["play", "played", "were playing", "have played"], correctAnswer: 2, category: "Grammar", level: "B2" },
  { id: "q8", question: `"Ephemeral" means:`, options: ["Permanent", "Short-lived", "Colorful", "Loud"], correctAnswer: 1, category: "Vocabulary", level: "C1" },
  { id: "q9", question: `The passive of "People speak English worldwide" is:`, options: ["English is spoken worldwide", "English speaks worldwide", "English spoke worldwide", "English was spoken"], correctAnswer: 0, category: "Grammar", level: "B2" },
  { id: "q10", question: `Choose the correct article: "___ apple a day keeps the doctor away."`, options: ["A", "An", "The", "—"], correctAnswer: 1, category: "Grammar", level: "A1" },
];

// ===== Nhóm 5: Forum =====
export const mockForumPosts: ForumPost[] = [
  {
    id: "f1", title: "How to improve English speaking skills?",
    content: "Hello everyone! I've been studying English for 2 years but still struggle with speaking. Any tips?",
    author: mockUsers[0], category: "speaking", tags: ["speaking", "tips", "beginner"],
    likes: 42, comments: [
      { id: "c1", content: "Practice daily with native speakers on iTalki!", author: mockUsers[1], createdAt: "2026-03-20", likes: 15 },
      { id: "c2", content: "Shadow native speakers on YouTube – works great for me.", author: mockUsers[0], createdAt: "2026-03-21", likes: 8 },
    ],
    createdAt: "2026-03-20", pinned: true,
  },
  {
    id: "f2", title: "Difference between 'will' and 'going to'",
    content: "I keep confusing these two future forms. Can someone explain clearly?",
    author: mockUsers[0], category: "grammar", tags: ["grammar", "future", "will"],
    likes: 28, comments: [],
    createdAt: "2026-03-21",
  },
];

// ===== Nhóm 5: Learning Plan =====
export const mockPlan: LearningPlan = {
  id: "p1", userId: "u1", title: "B1 → B2 in 90 Days",
  targetLevel: "B2", startDate: "2026-03-01", endDate: "2026-05-31",
  dailyGoalMinutes: 45,
  tasks: [
    { id: "t1", title: "Learn 20 new words", type: "vocabulary", completed: true, scheduledDate: "2026-03-22", durationMinutes: 15 },
    { id: "t2", title: "Grammar: Present Perfect", type: "grammar", completed: false, scheduledDate: "2026-03-22", durationMinutes: 20 },
    { id: "t3", title: "Listening Exercise: A2 Level", type: "listening", completed: false, scheduledDate: "2026-03-22", durationMinutes: 10 },
  ],
};

// ===== Courses =====
export const mockCourses: Course[] = [
  {
    id: "c1", title: "English for Beginners (A1-A2)", level: "A1",
    description: "Start your English journey from zero. Master basic conversations, vocabulary, and grammar.",
    teacher: mockUsers[1], category: "General English", rating: 4.8,
    totalStudents: 1240, totalLessons: 32, duration: "16 hours",
    price: 0, thumbnail: "", tags: ["beginner", "grammar", "speaking"],
    lessons: [
      { id: "l1", title: "Introduction & Greetings", description: "Learn basic greetings and introductions.", duration: 15, order: 1, completed: true },
      { id: "l2", title: "Numbers & Colors", description: "Essential vocabulary for everyday life.", duration: 20, order: 2, completed: false },
      { id: "l3", title: "My Daily Routine", description: "Talk about your daily activities.", duration: 25, order: 3, completed: false },
    ]
  },
  {
    id: "c2", title: "Business English Mastery (B2-C1)", level: "B2",
    description: "Professional English for workplace communication, presentations, and negotiations.",
    teacher: mockUsers[1], category: "Business English", rating: 4.9,
    totalStudents: 856, totalLessons: 48, duration: "24 hours",
    price: 299000, thumbnail: "", tags: ["business", "professional", "advanced"],
    lessons: []
  },
  {
    id: "c3", title: "IELTS Speaking Preparation", level: "B1",
    description: "Targeted practice for IELTS Speaking test. Score 7.0+ with proven strategies.",
    teacher: mockUsers[1], category: "IELTS", rating: 4.7,
    totalStudents: 2103, totalLessons: 24, duration: "12 hours",
    price: 199000, thumbnail: "", tags: ["ielts", "speaking", "exam"],
    lessons: []
  },
  {
    id: "c4", title: "Advanced Grammar Masterclass", level: "C1",
    description: "Deep dive into complex grammar structures. Perfect for advanced learners.",
    teacher: mockUsers[1], category: "Grammar", rating: 4.6,
    totalStudents: 445, totalLessons: 20, duration: "10 hours",
    price: 0, thumbnail: "", tags: ["grammar", "advanced"],
    lessons: []
  },
];

// ===== Nhóm 6: Teacher Stats =====
export const mockTeacherStats: TeacherStats = {
  totalCourses: 4,
  totalStudents: 4644,
  avgRating: 4.75,
  totalRevenue: 12500000,
  monthlyViews: [120, 250, 380, 420, 510, 490, 630, 720, 810, 950, 1100, 1380],
};

// ===== Leaderboard =====
export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, user: mockUsers[0], xp: 8900, streak: 28, level: "B2" },
  { rank: 2, user: { ...mockUsers[0], id: "u4", displayName: "Lê Văn Bình" }, xp: 7500, streak: 15, level: "B1" },
  { rank: 3, user: { ...mockUsers[0], id: "u5", displayName: "Phạm Thị Cúc" }, xp: 6800, streak: 22, level: "B1" },
  { rank: 4, user: { ...mockUsers[0], id: "u6", displayName: "Hoàng Văn Dũng" }, xp: 5400, streak: 9, level: "A2" },
  { rank: 5, user: { ...mockUsers[0], id: "u7", displayName: "Ngô Thị Em" }, xp: 4200, streak: 12, level: "A2" },
];
