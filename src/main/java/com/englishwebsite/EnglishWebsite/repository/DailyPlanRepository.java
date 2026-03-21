package com.englishwebsite.EnglishWebsite.repository;

import com.englishwebsite.EnglishWebsite.model.DailyPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DailyPlanRepository extends JpaRepository<DailyPlan, Long> {
    List<DailyPlan> findByUserId(String userId);
}
