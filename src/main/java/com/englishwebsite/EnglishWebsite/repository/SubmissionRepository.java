package com.englishwebsite.EnglishWebsite.repository;

import com.englishwebsite.EnglishWebsite.model.Submission;
import com.englishwebsite.EnglishWebsite.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, String> {
    List<Submission> findByUser(User user);
    List<Submission> findBySubmissionType(String submissionType);
    List<Submission> findByUser_UidAndSubmissionType(String userId, String submissionType);
}
