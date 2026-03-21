package com.englishwebsite.EnglishWebsite.repository;

import com.englishwebsite.EnglishWebsite.model.WritingExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WritingExerciseRepository extends JpaRepository<WritingExercise, String> {
    List<WritingExercise> findByUserId(String userId);
}
