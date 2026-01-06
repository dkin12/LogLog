package com.example.loglog.repository;

import com.example.loglog.entity.Comment;
import com.example.loglog.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // 게시글별 댓글 조회 (삭제 안 된 것만, 오래된 순)
    List<Comment> findByPostIdAndIsDeletedFalseOrderByCreatedAtAsc(Long postId);

    // 댓글 단건 조회 (삭제 안 된 것만)
    Optional<Comment> findByIdAndIsDeletedFalse(Long id);

    // 내가 단 댓글 목록 조회
    List<Comment> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(Long userId);

    // 내가 댓글 단 게시글 목록 조회
    @Query("""
        select distinct c.post
        from Comment c
        where c.user.id = :userId
          and c.isDeleted = false
    """)
    List<Post> findDistinctPostsCommentedByUser(@Param("userId") Long userId);
}
