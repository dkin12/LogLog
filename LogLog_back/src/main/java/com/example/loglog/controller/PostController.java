package com.example.loglog.controller;

import com.example.loglog.dto.request.PostCreateRequest;
import com.example.loglog.dto.request.PostUpdateRequest;
import com.example.loglog.dto.response.*;
import com.example.loglog.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // 1. 게시글 작성
    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestBody @Valid PostCreateRequest request,
            @AuthenticationPrincipal Long userId
    ) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        Long postId = postService.createPost(request, userId);

        return ResponseEntity.ok(postId);
    }

    // 2. 게시글 목록 조회 (카테고리 필터 / 검색 기능 포함)
    @GetMapping
    @Transactional(readOnly = true)
    public PageResponse<PostListResponse> getPostList(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) Long categoryId
    ) {
        return postService.getPostList(page, size, categoryId, keyword, tag);
    }

    // 2-1. 특정 유저가 쓴 게시글 목록 조회 (본인/타인)
    @GetMapping("/users/{targetUserId}")
    public List<MyPostResponse> getUserPosts(
            @PathVariable Long targetUserId,
            @AuthenticationPrincipal Long userId
    ) {
        // 로그인 안 한 경우 userId == null
        return postService.getUserPosts(targetUserId, userId);
    }

    // 3. 게시글 상세 조회
    @GetMapping("/{postId}")
    public ResponseEntity<PostDetailResponse> getPost(@PathVariable Long postId){
        return ResponseEntity.ok(postService.getPost(postId));
    }

    // 4. 게시글 수정
    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(
            @PathVariable Long postId,
            @RequestBody @Valid PostUpdateRequest request,
            @AuthenticationPrincipal Long userId
    ) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        Long updatedPostId = postService.updatePost(postId, request, userId);
        return ResponseEntity.ok(updatedPostId);
    }

    // 5. 게시글 삭제
    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal Long userId
    ) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        postService.deletePost(postId, userId);
        return ResponseEntity.ok("게시글이 삭제되었습니다.");
    }

    // 히스토리 목록 조회 API
    @GetMapping("/{postId}/history")
    public List<PostHistoryResponse> getPostHistoryList(@PathVariable Long postId) {
        return postService.getPostHistories(postId);
    }

    // 히스토리 개별(단건) 조회 API
    @GetMapping("/history/{historyId}")
    public PostHistoryResponse getPostHistoryDetail(@PathVariable Long historyId) {
        return postService.getPostHistoryDetail(historyId);
    }
    // 임시글 조회 api
    @GetMapping("/draft/{userId}")
    public List<PostDraftResponse> getPostDraftList(@PathVariable Long userId) {
        return postService.getPostDraftResponse(userId);
    }

}