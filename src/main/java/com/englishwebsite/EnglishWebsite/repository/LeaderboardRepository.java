package com.englishwebsite.EnglishWebsite.repository;

import com.englishwebsite.EnglishWebsite.model.LeaderboardEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaderboardRepository extends JpaRepository<LeaderboardEntry, String> {
    List<LeaderboardEntry> findAllByOrderByTotalPointsDesc();
}
