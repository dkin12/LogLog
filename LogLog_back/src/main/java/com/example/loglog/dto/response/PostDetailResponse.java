package com.example.loglog.dto.response;

import com.example.loglog.dto.type.PostStatus;
import com.example.loglog.entity.Post;
import com.example.loglog.entity.Tag;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDetailResponse {

    private Long id;
    private String title;
    private String content;
    private Long userId;
    private Integer categoryId;
    private String userNickname;
    private String categoryName;
    private String thumbnailUrl;
    private String draftYn;
    private PostStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> tags;


    public static PostDetailResponse fromEntity(Post post) {
        return PostDetailResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .userId(post.getUser().getId())
                .userNickname(post.getUser().getNickname())
                .status(post.getStatus())
                .categoryId(post.getCategory() != null ? post.getCategory().getCategoryId() : null)
                .categoryName(post.getCategory() != null ? post.getCategory().getCategoryName() : "")
                .thumbnailUrl(post.getThumbnailUrl())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .tags(
                        post.getPostTags().stream()              // PostTag 조회
                                .map(pt -> pt.getTag().getName())   // Tag 이름 추출
                                .collect(Collectors.toList())
                )
                .build();
    }
}
