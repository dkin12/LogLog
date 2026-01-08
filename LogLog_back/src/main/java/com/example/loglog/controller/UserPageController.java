package com.example.loglog.controller;

import com.example.loglog.dto.response.GrassResponse;
import com.example.loglog.dto.response.MyPostResponse;
import com.example.loglog.service.GrassService;
import com.example.loglog.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserPageController {

    private final GrassService grassService;
    private final PostService postService;

    // 잔디 연도 리스트
    @GetMapping("/{userId}/grass/years")
    public List<Integer> getUserGrassYears(
            @PathVariable Long userId,
            @AuthenticationPrincipal Long viewerId
    ) {
        return grassService.getGrassYears(userId);
    }

    // 타인 잔디
    @GetMapping("/{userId}/grass/recent")
    public List<GrassResponse> getUserGrassRecent(
            @PathVariable Long userId,
            @AuthenticationPrincipal Long viewerId
    ) {
        return grassService.getGrassRecent(userId, viewerId);
    }

    // 타인 연도별 잔디
    @GetMapping("/{userId}/grass")
    public List<GrassResponse> getUserGrassByYear(
            @PathVariable Long userId,
            @RequestParam int year,
            @AuthenticationPrincipal Long viewerId
    ) {
        return grassService.getGrassByYear(userId, viewerId, year);
    }

    // 타인 게시글 (공개글만)
    @GetMapping("/{userId}/posts")
    public List<MyPostResponse> getUserPosts(
            @PathVariable Long userId,
            @AuthenticationPrincipal Long viewerId
    ) {
        return postService.getUserPosts(userId, viewerId);
    }
}
