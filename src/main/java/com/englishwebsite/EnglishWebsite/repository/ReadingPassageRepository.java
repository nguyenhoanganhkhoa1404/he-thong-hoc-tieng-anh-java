package com.englishwebsite.EnglishWebsite.repository;

import com.englishwebsite.EnglishWebsite.model.ReadingPassage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReadingPassageRepository extends JpaRepository<ReadingPassage, String> {
}
