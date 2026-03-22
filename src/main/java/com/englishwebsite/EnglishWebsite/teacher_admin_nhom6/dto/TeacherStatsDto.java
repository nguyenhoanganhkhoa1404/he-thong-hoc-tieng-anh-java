package com.englishwebsite.EnglishWebsite.teacher_admin_nhom6.dto;

import java.util.List;

/**
 * Encapsulates the aggregated statistical metrics for a specific Teacher's Dashboard.
 */
public class TeacherStatsDto {
    private int totalCourses;
    private int totalStudents;
    private double avgRating;
    private double totalRevenue;
    private List<Integer> monthlyViews;

    public TeacherStatsDto() {}

    public TeacherStatsDto(int totalCourses, int totalStudents, double avgRating, double totalRevenue, List<Integer> monthlyViews) {
        this.totalCourses = totalCourses;
        this.totalStudents = totalStudents;
        this.avgRating = avgRating;
        this.totalRevenue = totalRevenue;
        this.monthlyViews = monthlyViews;
    }

    public int getTotalCourses() { return totalCourses; }
    public void setTotalCourses(int totalCourses) { this.totalCourses = totalCourses; }

    public int getTotalStudents() { return totalStudents; }
    public void setTotalStudents(int totalStudents) { this.totalStudents = totalStudents; }

    public double getAvgRating() { return avgRating; }
    public void setAvgRating(double avgRating) { this.avgRating = avgRating; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public List<Integer> getMonthlyViews() { return monthlyViews; }
    public void setMonthlyViews(List<Integer> monthlyViews) { this.monthlyViews = monthlyViews; }
}
