package com.example.loglog.controller;

import com.example.loglog.dto.response.GrassResponse;
import com.example.loglog.dto.response.MyCommentResponse;
import com.example.loglog.dto.response.MyPostResponse;
import com.example.loglog.service.GrassService;
import com.example.loglog.service.LogService;
import com.example.loglog.service.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage")
public class MyPageController {

    private final LogService logService;
    private final GrassService grassService;
    private final MyPageService myPageService;

    // 최근 1년 잔디
    @GetMapping("/grass/recent")
    public List<GrassResponse> getGrassRecent(
            @AuthenticationPrincipal Long userId
    ) {
        return grassService.getGrassRecent(userId);
    }

    // 연도별 잔디
    @GetMapping("/grass")
    public List<GrassResponse> getGrass(
            @RequestParam int year,
            @AuthenticationPrincipal Long userId
    ) {
        return logService.getGrass(userId, year);
    }

    // 잔디 연도 리스트
    @GetMapping("/grass/years")
    public List<Integer> getGrassYears(
            @AuthenticationPrincipal Long userId
    ) {
        return grassService.getGrassYears(userId);
    }

    // 내 글 조회
    @GetMapping("/posts")
    public List<MyPostResponse> getMyPosts(
            @AuthenticationPrincipal Long userId
    ) {
        return myPageService.getMyPosts(userId);
    }

    // 내 댓글 조회 (필요하면)
/*    @GetMapping("/comments")
    public List<MyCommentResponse> getMyComments(
            @AuthenticationPrincipal Long userId
    ) {
        return myPageService.getMyComments(userId);
    }*/
}
