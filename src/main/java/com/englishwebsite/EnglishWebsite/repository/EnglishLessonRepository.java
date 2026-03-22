package com.englishwebsite.EnglishWebsite.repository;

import com.englishwebsite.EnglishWebsite.model.EnglishLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnglishLessonRepository extends JpaRepository<EnglishLesson, String> {
    List<EnglishLesson> findBySkill(String skill);
}
