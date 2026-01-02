package com.example.loglog.repository;

import com.example.loglog.dto.type.PostStatus;
import com.example.loglog.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByStatusNotOrderByCreatedAtDesc(PostStatus status);


    // 검색어가 있을 때
    Page<Post> findByTitleContainingOrContentContaining(String title, String content, Pageable pageable);
}

