package com.example.loglog.repository;

import com.example.loglog.dto.type.PostStatus;
import com.example.loglog.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByStatusNotOrderByCreatedAtDesc(PostStatus status);
}

