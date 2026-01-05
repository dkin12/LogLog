package com.example.loglog.service;

import com.example.loglog.dto.response.MyPostResponse;
import com.example.loglog.entity.Post;
import com.example.loglog.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyPageService {

    private final PostRepository postRepository;

    public List<MyPostResponse> getMyPosts(Long userId) {
        List<Post> posts = postRepository.findMyPosts(userId);

        return posts.stream()
                .map(MyPostResponse::from)
                .toList();
    }
}
