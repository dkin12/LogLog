package com.example.loglog.repository;

import com.example.loglog.entity.PostHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostHistoryRepository extends JpaRepository<PostHistory, Long> {
    // 특정 게시글의 히스토리를 최신순으로 조회
    List<PostHistory> findByPostIdOrderByArchivedAtDesc(Long postId);
}
