package com.englishwebsite.EnglishWebsite.repository;

import com.englishwebsite.EnglishWebsite.model.EnglishQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnglishQuestionRepository extends JpaRepository<EnglishQuestion, Long> {
    List<EnglishQuestion> findByCategoryId(Integer categoryId);
}
