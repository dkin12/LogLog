package com.example.loglog.service;

import com.example.loglog.dto.request.PostCreateRequest;
import com.example.loglog.dto.request.PostUpdateRequest;
import com.example.loglog.dto.response.PostDetailResponse;
import com.example.loglog.dto.response.PostListResponse;
import com.example.loglog.dto.type.PostStatus;
import com.example.loglog.entity.Category;
import com.example.loglog.entity.Post;
import com.example.loglog.entity.Tag;
import com.example.loglog.entity.User;
import com.example.loglog.repository.CategoryRepository;
import com.example.loglog.repository.PostRepository;
import com.example.loglog.repository.TagRepository;
import com.example.loglog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final CategoryRepository categoryRepository;

    // 게시글 작성
    @Transactional
    public Long createPost(PostCreateRequest request, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("회원정보가 없습니다."));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(()->new IllegalArgumentException("카테고리가 없습니다."));

        Post post = request.toEntity(user,category);

        addTags(post,request.getTags());

        return postRepository.save(post).getId();

    }
/*
    // [게시글 수정] - 수정 기능 구현 시 필요
    @Transactional
    public Long updatePost(Long postId, PostUpdateRequest request, Long userId) {
        Post post = postRepository.findById(request.);

        // ... 본인 확인 및 기본 정보 업데이트(post.update) ...

        // ✨ 태그 수정 로직
        // 1. 기존 태그 싹 비우기
        post.clearTags();
        // 2. 새로운 태그 다시 채우기
        addTags(post, request.getTags());

        return post.getId();
    }
 */
    // PostService.java 내부



    private void addTags(Post post, List<String> tagNames) {
        if (tagNames == null || tagNames.isEmpty()) {
            return;
        }

        for (String tagName : tagNames) {
            // 1. 이름으로 태그를 찾는다.
            // 2. 없으면 새로 만들어서 저장(save) 후 가져온다.
            Tag tag = tagRepository.findByName(tagName)
                    .orElseGet(() -> tagRepository.save(new Tag(tagName)));

            // 3. 게시글에 태그를 '추가'만 한다. (setPost 아님!)
            post.addTag(tag);
        }
        // ★ 주의: Post는 변경 감지(Dirty Checking) 혹은 cascade 설정에 의해
        // 트랜잭션 종료 시 연결 정보가 중간 테이블(log_post_tags)에 자동 저장됩니다.
    }

    // 게시글 목록 조회
    @Transactional(readOnly = true)
    public List<PostListResponse> getPostList() {
        List<Post> posts = postRepository.findAllByStatusNotOrderByCreatedAtDesc(PostStatus.PRIVATE);
        return posts.stream().map(PostListResponse::fromEntity).collect(Collectors.toList());

    }

    // 게시글 상세 조회
    public PostDetailResponse getPost(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"post with id " + postId + "not found"));
        post.increaseViews();
        return PostDetailResponse.fromEntity(post);
    }

    // 게시글 수정
    @Transactional
    public Long updatePost(Long postId, PostUpdateRequest request, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        if (!post.getUser().getId().equals(userId)) {
            throw new IllegalStateException("수정 권한이 없습니다.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("카테고리가 없습니다."));

        post.update(
                request.getTitle(),
                request.getContent(),
                request.getThumbnailUrl(),
                category, // 👈 여기에 객체가 들어가야 함
                request.getStatus()
        );

        post.clearTags();
        addTags(post, request.getTags()); // 아까 만든 addTags 메서드 재활용

        return post.getId();
    }

    // 게시글 삭제
    @Transactional
    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"post with id " + postId + "not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new IllegalStateException("수정 권한이 없습니다.");
        }

        postRepository.deleteById(postId);
    }

}
