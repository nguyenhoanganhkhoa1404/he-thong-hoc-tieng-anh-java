package com.englishwebsite.EnglishWebsite.model;

import jakarta.persistence.*;

@Entity
@Table(name = "leaderboard")
public class LeaderboardEntry {
    @Id
    @Column(name = "user_id", length = 50)
    private String userId;

    private String displayName;

    @Column(name = "total_points")
    private int totalPoints;

    private int rank;

    public LeaderboardEntry() {}

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public int getTotalPoints() { return totalPoints; }
    public void setTotalPoints(int totalPoints) { this.totalPoints = totalPoints; }
    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }
}
