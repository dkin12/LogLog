package com.example.loglog.repository;

import com.example.loglog.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostDraftRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserIdAndDraftYnOrderByCreatedAtDesc(Long userId, String draftYn);
}