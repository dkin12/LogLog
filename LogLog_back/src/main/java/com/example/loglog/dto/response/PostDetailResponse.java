package com.example.loglog.dto.response;

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
    private String userNickname;
    private String categoryName;
    private String thumbnail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> tags;


    public static PostDetailResponse fromEntity(Post post) {
        return PostDetailResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .userNickname(post.getUser().getNickname())
                .categoryName(post.getCategory().getCategoryName())
                .thumbnail(post.getThumbnailUrl())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .tags(post.getTags().stream()
                        .map(Tag::getName) // Tag 객체를 String(이름)으로 변환
                        .collect(Collectors.toList())) // 리스트로 포장
                .build();
    }
}
