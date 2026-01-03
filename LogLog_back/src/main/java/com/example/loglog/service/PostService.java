package com.example.loglog.service;

import com.example.loglog.dto.request.PostCreateRequest;
import com.example.loglog.dto.request.PostUpdateRequest;
import com.example.loglog.dto.response.PageResponse;
import com.example.loglog.dto.response.PostDetailResponse;
import com.example.loglog.dto.response.PostListResponse;
import com.example.loglog.dto.response.PostResponse;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    private void addTags(Post post, List<String> tagNames) {
        if (tagNames == null || tagNames.isEmpty()) {
            return;
        }

        for (String tagName : tagNames) {
            Tag tag = tagRepository.findByName(tagName)
                    .orElseGet(() -> tagRepository.save(new Tag(tagName)));
            post.addTag(tag);
        }
    }

//    // 게시글 목록 조회
//    @Transactional(readOnly = true)
//    public List<PostListResponse> getPostList() {
//        List<Post> posts = postRepository.findAllByStatusNotOrderByCreatedAtDesc(PostStatus.PRIVATE);
//        return posts.stream().map(PostListResponse::fromEntity).collect(Collectors.toList());
//
//    }// 게시글 목록 조회
//    @Transactional(readOnly = true)
//    public List<PostListResponse> getPostList() {
//        List<Post> posts = postRepository.findAllByStatusNotOrderByCreatedAtDesc(PostStatus.PRIVATE);
//        return posts.stream().map(PostListResponse::fromEntity).collect(Collectors.toList());
//
//    }

    // 게시글 조회(필터/검색)
    @Transactional(readOnly = true)
    public PageResponse<PostListResponse> getPostList(int page, int size, String keyword, Long categoryId) {
        int currentPage = Math.max(page - 1, 0);
        Pageable pageable = PageRequest.of(currentPage, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> postPage;

        if (categoryId != null && keyword != null && !keyword.isBlank()) {
            // 1) 카테고리 + 검색
            postPage = postRepository
                    .findByCategory_CategoryIdAndTitleContainingOrContentContaining(
                            categoryId, keyword, keyword, pageable
                    );
        } else if (categoryId != null) {
            // 2) 카테고리 필터
            postPage = postRepository
                    .findByCategory_CategoryId(categoryId, pageable);
        } else if (keyword != null && !keyword.isBlank()) {
            // 3) 검색
            postPage = postRepository
                    .findByTitleContainingOrContentContaining(
                            keyword, keyword, pageable
                    );
        } else {
            // 4) 전체 조회
            postPage = postRepository.findAll(pageable);
        }
        return PageResponse.from(postPage, PostListResponse::fromEntity);
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
                category,
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
