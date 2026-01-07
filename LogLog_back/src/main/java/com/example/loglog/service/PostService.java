package com.example.loglog.service;

import com.example.loglog.dto.request.PostCreateRequest;
import com.example.loglog.dto.request.PostUpdateRequest;
import com.example.loglog.dto.response.*;
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
    private final PostHistoryRepository postHistoryRepository;
    private final CommentRepository commentRepository;

    private final LogService logService;
    private final PostDraftRepository postDraftRepository;

    // 게시글 작성
    @Transactional
    public Long createPost(PostCreateRequest request, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("회원정보가 없습니다."));
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElse(null); // 또는 예외 처리
        }
        Post post = request.toEntity(user, category);


        postRepository.save(post);

        addTags(post, request.getTags());

        // 하나 history 쌓음
        PostHistory history = PostHistory.builder()
                .post(post)
                .userId(userId)
                .title(post.getTitle())
                .content(post.getContent())
                .thumbnailUrl(post.getThumbnailUrl())
                .status(post.getStatus())
                .categoryId(
                        post.getCategory() != null
                                ? post.getCategory().getCategoryId()
                                : null
                )
                .build();

        if (request.getDraftYn().equals("N")) {
            if (post.getStatus() == PostStatus.PUBLISHED) {
                post.publishNow();
                logService.recordPostPublish(post.getUser(), post.getId());
            }
            postHistoryRepository.save(history);
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
                    categoryId, tag, PostStatus.PUBLISHED, "N",idPageable)
                    : postRepository.findPostIdsByTag(
                    tag, PostStatus.PUBLISHED,"N", idPageable);

            if (postIdPage.isEmpty()) {
                return PageResponse.from(
                        new PageImpl<>(List.of(), postPageable, 0),
                        PostListResponse::fromEntity
                );
            }

            List<Post> posts =
                    postRepository.findAllByIdIn(postIdPage.getContent(),"N");

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
                    categoryId, keyword, PostStatus.PUBLISHED,"N", postPageable)
                    : postRepository.findByKeyword(
                    keyword, PostStatus.PUBLISHED,"N", postPageable);

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
                PostStatus.PUBLISHED, "N" ,postPageable);




        return PageResponse.from(postPage, PostListResponse::fromEntity);
    }

    /* ============================
       게시글 상세 조회
     ============================ */
    public PostDetailResponse getPost(Long postId) {

        Post post = postRepository.findByIdWithTags(postId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "post with id " + postId + " not found"));

        post.increaseViews();
        return PostDetailResponse.fromEntity(post);
    }

    // 특정 유저 게시글 조회 (본인: 공개+비밀 / 타인: 공개)
    public List<MyPostResponse> getUserPosts(Long ownerId, Long viewerId) {

        boolean isOwner = viewerId != null && ownerId.equals(viewerId);

        List<Post> posts = isOwner
                ? postRepository.findByUserId(ownerId,"N")
                : postRepository.findPublicPostsByUserId(ownerId,"N");

        return posts.stream()
                .map(MyPostResponse::from)
                .toList();
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

        Category category = (request.getCategoryId() != null)
                ? categoryRepository.findById(request.getCategoryId()).orElse(null)
                : null;

        // 1. 엔티티 정보 업데이트 (여기서 PRIVATE/PUBLISHED가 결정됨)
        post.update(
                request.getTitle(),
                request.getContent(),
                request.getThumbnailUrl(),
                category,
                request.getStatus(),
                request.getDraftYN()
        );

        // 2. 발행(N)일 때만 실행되는 로직
        if ("N".equals(request.getDraftYN())) {

            // [중요] 상태가 PUBLISHED일 때만 발행 시각을 갱신하고 로그를 남김
            if (post.getStatus() == PostStatus.PUBLISHED) {
                post.publishNow();
                logService.recordPostPublish(post.getUser(), post.getId());
            }

            // 히스토리는 발행(N) 시점에 무조건 남김 (상태가 PRIVATE여도 내역은 남아야 하므로)
            PostHistory history = PostHistory.builder()
                    .post(post)
                    .userId(userId)
                    .title(post.getTitle())
                    .content(post.getContent())
                    .thumbnailUrl(post.getThumbnailUrl())
                    .status(post.getStatus())
                    .categoryId(category != null ? category.getCategoryId() : null)
                    .build();
            postHistoryRepository.save(history);
        }

        // 3. 태그 처리
        post.clearTags();
        addTags(post, request.getTags());

        // 4. [수정] 맨 밑에 있던 무조건 로그 남기는 코드는 삭제함!
        return post.getId();
    }

    /* ============================
       게시글 삭제
     ============================ */
    @Transactional
    public void deletePost(Long postId, Long userId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "post not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new IllegalStateException("삭제 권한이 없습니다.");
        }

        // 자식 먼저 정리
        commentRepository.deleteByPostId(postId);
        postHistoryRepository.deleteByPostId(postId);
        postTagRepository.deleteByPostId(postId);

        // 마지막에 부모 삭제
        postRepository.delete(post);
    }

     /* ============================
       게시글 히스토리 목록
     ============================ */

    @Transactional(readOnly = true)
    // 기능 1: 목록 조회 (특정 게시글의 모든 히스토리)
    public List<PostHistoryResponse> getPostHistories(Long postId) {
        // Entity 리스트 조회
        List<PostHistory> histories = postHistoryRepository.findByPostIdOrderByArchivedAtDesc(postId);

        // Entity List -> DTO List 변환
        return histories.stream()
                .map(PostHistoryResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    // 기능 2: 개별 조회 (특정 히스토리 하나만)
    public PostHistoryResponse getPostHistoryDetail(Long historyId) {
        // Entity 단건 조회 (없으면 예외 발생)
        PostHistory postHistory = postHistoryRepository.findById(historyId)
                .orElseThrow(() -> new IllegalArgumentException("해당 히스토리를 찾을 수 없습니다. id=" + historyId));

        // Entity -> DTO 변환
        return PostHistoryResponse.from(postHistory);
    }
    /* ============================
       게시글 임시 조회
     ============================ */
    @Transactional(readOnly = true)
    public List<PostDraftResponse> getPostDraftResponse(Long userId){
         List<Post> postsDraftList = postDraftRepository.findByUserIdAndDraftYnOrderByCreatedAtDesc(userId,"Y");
        return postsDraftList.stream()
                .map(PostDraftResponse::from)
                .collect(Collectors.toList());
    }



}
