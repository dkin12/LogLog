package com.example.loglog.service;

import com.example.loglog.dto.request.PostCreateRequest;
import com.example.loglog.dto.request.PostUpdateRequest;
import com.example.loglog.dto.response.PageResponse;
import com.example.loglog.dto.response.PostDetailResponse;
import com.example.loglog.dto.response.PostListResponse;
import com.example.loglog.dto.type.PostStatus;
import com.example.loglog.entity.*;
import com.example.loglog.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
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
    private final PostTagRepository postTagRepository;
    private final CategoryRepository categoryRepository;
    private final LogService logService;

    // 게시글 작성
    @Transactional
    public Long createPost(PostCreateRequest request, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("회원정보가 없습니다."));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("카테고리가 없습니다."));

        // 게시글 먼저 저장
        Post post = postRepository.save(request.toEntity(user, category));

        // 태그 매핑
        addTags(post, request.getTags());

        // 발행인 경우만 로그 (임시저장은 집계 X)
        if (post.getStatus() != PostStatus.DRAFT) {
            logService.recordPostPublish(
                    user,
                    PostStatus.DRAFT,      // 생성은 항상 DRAFT에서 시작
                    post.getStatus(),
                    post.getId()
            );
        }
        return post.getId();
    }

    /* ============================
       태그 연결 로직 (PostTag 생성)
     ============================ */
    private void addTags(Post post, List<String> tagNames) {
        if(tagNames == null || tagNames.isEmpty()) return;

        for(String raw : tagNames) {
            String name = raw.startsWith("#") ? raw.substring(1) : raw;

            Tag tag = tagRepository.findByName(name)
                    .orElseGet(() -> tagRepository.save(new Tag(name)));

            postTagRepository.save(new PostTag(post, tag));
        }
    }

    /* ============================
       게시글 목록 조회 (검색/필터/해시태그)
     ============================ */
    @Transactional(readOnly = true)
    public PageResponse<PostListResponse> getPostList(
            int page,
            int size,
            Long categoryId,
            String keyword,
            String tag
    ) {
        int currentPage = Math.max(page - 1, 0);

        Pageable idPageable = PageRequest.of(currentPage, size); // ID 조회용
        Pageable postPageable = PageRequest.of(
                currentPage,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        ); // Post 조회용

        Page<Post> postPage;

        // 태그 검색
        if (tag != null && !tag.isBlank()) {

            Page<Long> postIdPage = (categoryId != null)
                    ? postRepository.findPostIdsByCategoryAndTag(
                    categoryId, tag, PostStatus.PUBLISHED, idPageable)
                    : postRepository.findPostIdsByTag(
                    tag, PostStatus.PUBLISHED, idPageable);

            if (postIdPage.isEmpty()) {
                return PageResponse.from(
                        new PageImpl<>(List.of(), postPageable, 0),
                        PostListResponse::fromEntity
                );
            }

            List<Post> posts =
                    postRepository.findAllByIdIn(postIdPage.getContent());

            postPage = new PageImpl<>(
                    posts,
                    postPageable,
                    postIdPage.getTotalElements()
            );

            return PageResponse.from(postPage, PostListResponse::fromEntity);
        }

        // 일반 검색
        if (keyword != null && !keyword.isBlank()) {
            postPage = (categoryId != null)
                    ? postRepository.findByCategoryAndKeyword(
                    categoryId, keyword, PostStatus.PUBLISHED, postPageable)
                    : postRepository.findByKeyword(
                    keyword, PostStatus.PUBLISHED, postPageable);

            return PageResponse.from(postPage, PostListResponse::fromEntity);
        }

        // 카테고리만
        if (categoryId != null) {
            postPage = postRepository.findByCategory(
                    categoryId, PostStatus.PUBLISHED, postPageable);

            return PageResponse.from(postPage, PostListResponse::fromEntity);
        }

        // 전체 조회
        postPage = postRepository.findAllByStatus(
                PostStatus.PUBLISHED, postPageable);

        return PageResponse.from(postPage, PostListResponse::fromEntity);
    }

    /* ============================
       게시글 상세 조회
     ============================ */
    public PostDetailResponse getPost(Long postId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "post with id " + postId + " not found"));

        post.increaseViews();
        return PostDetailResponse.fromEntity(post);
    }

    /* ============================
       게시글 수정
     ============================ */
    @Transactional
    public Long updatePost(Long postId, PostUpdateRequest request, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        if (!post.getUser().getId().equals(userId)) {
            throw new IllegalStateException("수정 권한이 없습니다.");
        }

        // update 전에 상태 백업
        PostStatus oldStatus = post.getStatus();

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("카테고리가 없습니다."));

        // 게시글 수정 (status 포함)
        post.update(
                request.getTitle(),
                request.getContent(),
                request.getThumbnailUrl(),
                category,
                request.getStatus()
        );

        post.clearTags();
        addTags(post, request.getTags()); // 아까 만든 addTags 메서드 재활용

        // 수정 후 발행 로그
        logService.recordPostPublish(
                post.getUser(),
                oldStatus,
                post.getStatus(),
                post.getId()
        );

        return post.getId();
    }

    /* ============================
       게시글 삭제
     ============================ */
    @Transactional
    public void deletePost(Long postId, Long userId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "post with id " + postId + " not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new IllegalStateException("삭제 권한이 없습니다.");
        }

        postRepository.deleteById(postId);
    }

}
