package com.englishwebsite.EnglishWebsite.repository;

import com.englishwebsite.EnglishWebsite.model.ListeningLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ListeningLessonRepository extends JpaRepository<ListeningLesson, String> {
}
