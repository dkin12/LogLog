package com.example.loglog.controller;

import com.example.loglog.dto.response.GrassResponse;
import com.example.loglog.dto.response.MyPostResponse;
import com.example.loglog.service.GrassService;
import com.example.loglog.service.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage")
public class MyPageController {

    private final GrassService grassService;
    private final MyPageService myPageService;

    // 내 마이페이지 - 최근 잔디 (본인 = owner = viewer)
    @GetMapping("/grass/recent")
    public List<GrassResponse> getMyGrassRecent(
            @AuthenticationPrincipal Long userId
    ) {
        return grassService.getGrassRecent(userId, userId);
    }

    // 연도별 잔디 (내 것)
    @GetMapping("/grass")
    public List<GrassResponse> getGrass(
            @RequestParam int year,
            @AuthenticationPrincipal Long userId
    ) {
        return grassService.getGrassByYear(userId, year);
    }

    // 잔디 연도 리스트
    @GetMapping("/grass/years")
    public List<Integer> getGrassYears(
            @AuthenticationPrincipal Long userId
    ) {
        return grassService.getGrassYears(userId);
    }

    // 내 게시글
    @GetMapping("/posts")
    public List<MyPostResponse> getMyPosts(
            @AuthenticationPrincipal Long userId
    ) {
        return myPageService.getMyPosts(userId);
    }
}
