package com.example.loglog.service;

import com.example.loglog.dto.response.MyPostResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyPageService {

    private final PostService postService;

    public List<MyPostResponse> getMyPosts(Long userId) {
        return postService.getUserPosts(userId, userId);
    }
}
