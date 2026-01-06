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

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserPageController {

    private final GrassService grassService;
    private final PostService postService;

    // 타인 잔디
    @GetMapping("/{userId}/grass/recent")
    public List<GrassResponse> getUserGrassRecent(
            @PathVariable Long userId,
            @AuthenticationPrincipal Long viewerId
    ) {
        return grassService.getGrassRecent(userId, viewerId);
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
