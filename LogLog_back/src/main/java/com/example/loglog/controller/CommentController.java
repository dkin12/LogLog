package com.example.loglog.controller;

import com.example.loglog.dto.request.CommentCreateRequest;
import com.example.loglog.dto.request.CommentUpdateRequest;
import com.example.loglog.dto.response.CommentResponse;
import com.example.loglog.dto.response.MyCommentResponse;
import com.example.loglog.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class CommentController {
    private final CommentService commentService;

    // 게시글 상세 - 댓글 목록 조회
    @GetMapping("/posts/{postId}/comments")
    public List<CommentResponse> getComments(@PathVariable Long postId) {
        return commentService.getCommentsByPost(postId)
                .stream()
                .map(CommentResponse::from)
                .toList();
    }

    // 내가 쓴 댓글 조회
    @GetMapping("/mypage/comments")
    public List<MyCommentResponse> getMyComments(@AuthenticationPrincipal Long userId) {
        return commentService.getMyComments(userId);
    }

    // 댓글 등록
    @PostMapping("/posts/{postId}/comments")
    public Long createComment(
            @PathVariable Long postId,
            @RequestBody CommentCreateRequest request,
            @AuthenticationPrincipal Long userId
    ) {
        return commentService.createComment(postId, userId, request.getContent());
    }

    // 댓글 수정
    @PutMapping("/comments/{commentId}")
    public void updateComment(
            @PathVariable Long commentId,
            @RequestBody CommentUpdateRequest request,
            @AuthenticationPrincipal Long userId
    ) {
        commentService.updateComment(commentId, userId, request.getContent());
    }

    // 댓글 삭제 (소프트 삭제)
    @DeleteMapping("/comments/{commentId}")
    public void deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal Long userId
    ) {
        commentService.deleteComment(commentId, userId);
    }
}
