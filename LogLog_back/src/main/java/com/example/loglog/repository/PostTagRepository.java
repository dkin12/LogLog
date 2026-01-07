package com.example.loglog.repository;

import com.example.loglog.entity.PostTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostTagRepository extends JpaRepository<PostTag, Long> {
    // 특정 게시글의 태그 목록 삭제
    @Modifying
    @Query("delete from PostTag pt where pt.post.id = :postId")
    void deleteByPostId(@Param("postId") Long postId);

}
