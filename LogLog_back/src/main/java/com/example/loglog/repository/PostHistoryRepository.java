package com.example.loglog.repository;

import com.example.loglog.entity.Post;
import com.example.loglog.entity.PostHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostHistoryRepository extends JpaRepository<PostHistory, Long> {
    // 특정 게시글의 히스토리 삭제
    @Modifying
    @Query("delete from PostHistory h where h.post.id = :postId")
    void deleteByPostId(@Param("postId") Long postId);

    // 특정 게시글의 히스토리를 최신순으로 조회
    List<PostHistory> findByPostIdOrderByArchivedAtDesc(Long postId);

}
