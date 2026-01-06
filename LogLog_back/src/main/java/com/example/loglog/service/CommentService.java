package com.example.loglog.service;

import com.example.loglog.entity.Comment;
import com.example.loglog.entity.Post;
import com.example.loglog.entity.User;
import com.example.loglog.repository.CommentRepository;
import com.example.loglog.repository.PostRepository;
import com.example.loglog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    // 댓글 조회 - 게시글 상세 페이지에서
    @Transactional(readOnly = true)
    public List<Comment> getCommentsByPost(Long postId) {
        return commentRepository.findByPostIdAndIsDeletedFalseOrderByCreatedAtAsc(postId);
    }

    // 댓글 조회 - 내가 단 댓글 목록
    @Transactional(readOnly = true)
    public List<Comment> getMyComments(Long userId) {
        return commentRepository.findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(userId);
    }

    // 댓글 등록
    public Long createComment(Long postId, Long userId, String content) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        Comment comment = Comment.builder()
                .post(post)
                .user(user)
                .content(content)
                .build();

        commentRepository.save(comment);
        return comment.getId();
    }

    // 댓글 수정
    public void updateComment(Long commentId, Long userId, String content) {
        Comment comment = commentRepository.findByIdAndIsDeletedFalse(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다."));

        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalStateException("댓글 수정 권한이 없습니다.");
        }

        comment.updateContent(content);
    }

    // 댓글 삭제 (소프트 삭제)
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findByIdAndIsDeletedFalse(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다."));

        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalStateException("댓글 삭제 권한이 없습니다.");
        }

        comment.delete();
    }
}
