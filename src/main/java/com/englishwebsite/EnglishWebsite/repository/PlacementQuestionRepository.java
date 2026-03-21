package com.englishwebsite.EnglishWebsite.repository;

import com.englishwebsite.EnglishWebsite.model.PlacementQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlacementQuestionRepository extends JpaRepository<PlacementQuestion, String> {
    List<PlacementQuestion> findByLevel(String level);
}
