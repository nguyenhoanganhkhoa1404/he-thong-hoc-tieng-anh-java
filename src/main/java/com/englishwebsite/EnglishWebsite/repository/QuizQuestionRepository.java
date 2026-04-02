package com.englishwebsite.EnglishWebsite.repository;

import com.englishwebsite.EnglishWebsite.model.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, String> {
    List<QuizQuestion> findByLessonId(String lessonId);
    List<QuizQuestion> findByTestSetId(String testSetId);
    List<QuizQuestion> findByDifficultyLevel(String difficultyLevel);
}
