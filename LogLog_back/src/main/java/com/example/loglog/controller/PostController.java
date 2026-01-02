package com.example.loglog.controller;

import com.example.loglog.dto.request.PostCreateRequest;
import com.example.loglog.dto.request.PostUpdateRequest;
import com.example.loglog.dto.response.PageResponse;
import com.example.loglog.dto.response.PostDetailResponse;
import com.example.loglog.dto.response.PostListResponse;
import com.example.loglog.service.PostService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    // 2. 게시글 목록 조회
    @GetMapping
    public ResponseEntity<PageResponse<PostListResponse>> getPostsList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword
    ){
        return ResponseEntity.ok(postService.getPostList(page,size,keyword));
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
}