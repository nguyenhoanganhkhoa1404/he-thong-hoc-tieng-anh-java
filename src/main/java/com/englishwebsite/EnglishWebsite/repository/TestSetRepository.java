package com.englishwebsite.EnglishWebsite.repository;

import com.englishwebsite.EnglishWebsite.model.TestSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestSetRepository extends JpaRepository<TestSet, String> {
    List<TestSet> findByType(String type);
    List<TestSet> findByLevel(String level);
    List<TestSet> findByTeacherId(String teacherId);
}
