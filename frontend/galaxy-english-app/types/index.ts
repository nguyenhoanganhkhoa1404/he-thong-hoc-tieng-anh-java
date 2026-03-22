// ===== All TypeScript interfaces for the Galaxy English Learning Platform =====

// User & Auth
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: "LEARNER" | "TEACHER" | "ADMIN";
  photoUrl?: string;
  specialization?: string;
  level?: string; // A1, A2, B1, B2, C1, C2
  xp?: number;
  streak?: number;
  active?: boolean;
  placementTestScore?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
  role?: "LEARNER" | "TEACHER";
}

// ===== Nhóm 2: Vocabulary & Grammar =====
export interface VocabItem {
  id: string;
  word: string;
  phonetic: string;
  type: "noun" | "verb" | "adjective" | "adverb" | "phrase";
  meaning: string; // Vietnamese
  example: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  topic?: string;
}

export interface GrammarLesson {
  id: string;
  title: string;
  description: string;
  level: string;
  content: string;
  examples: string[];
  exercises: GrammarExercise[];
}

export interface GrammarExercise {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// ===== Nhóm 3: Listening & Speaking =====
export interface ListeningExercise {
  id: string;
  title: string;
  audioUrl: string;
  transcript: string;
  level: string;
  duration: number; // seconds
  questions: QuizQuestion[];
}

export interface SpeakingExercise {
  id: string;
  title: string;
  prompt: string;
  sampleAnswer: string;
  level: string;
  tips: string[];
}

// ===== Nhóm 4: Quiz, Writing & Progress =====
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category?: string;
  level?: string;
}

export interface QuizResult {
  totalQuestions: number;
  correct: number;
  score: number;
  timeTaken: number;
  answers: { questionId: string; selected: number; correct: boolean }[];
}

export interface WritingPrompt {
  id: string;
  title: string;
  prompt: string;
  type: "paragraph" | "essay" | "email" | "letter";
  level: string;
  wordLimit: { min: number; max: number };
}

export interface LearningProgress {
  userId: string;
  vocabLearned: number;
  quizScore: number;
  streak: number;
  weeklyGoal: number;
  weeklyProgress: number;
  completedLessons: string[];
  xp: number;
  level: string;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt?: string;
}

// ===== Nhóm 5: Plan & Forum =====
export interface LearningPlan {
  id: string;
  userId: string;
  title: string;
  targetLevel: string;
  startDate: string;
  endDate: string;
  dailyGoalMinutes: number;
  tasks: PlanTask[];
}

export interface PlanTask {
  id: string;
  title: string;
  type: "vocabulary" | "grammar" | "listening" | "speaking" | "quiz" | "writing";
  completed: boolean;
  scheduledDate: string;
  durationMinutes: number;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: User;
  category: "grammar" | "vocabulary" | "speaking" | "listening" | "general";
  tags: string[];
  likes: number;
  comments: ForumComment[];
  createdAt: string;
  pinned?: boolean;
}

export interface ForumComment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  likes: number;
}

// ===== Courses (General) =====
export interface Course {
  id: string;
  title: string;
  description: string;
  teacher: User;
  level: string;
  category: string;
  thumbnail: string;
  rating: number;
  totalStudents: number;
  totalLessons: number;
  duration: string;
  price: number; // 0 = free
  tags: string[];
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  content?: string;
  duration: number; // minutes
  order: number;
  completed?: boolean;
}

// ===== Nhóm 6: Teacher & Admin =====
export interface TeacherStats {
  totalCourses: number;
  totalStudents: number;
  avgRating: number;
  totalRevenue: number;
  monthlyViews: number[];
}

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalTeachers: number;
  activeStudents: number;
  monthlyRevenue: number;
  recentSignups: User[];
}

// ===== Leaderboard =====
export interface LeaderboardEntry {
  rank: number;
  user: User;
  xp: number;
  streak: number;
  level: string;
}
