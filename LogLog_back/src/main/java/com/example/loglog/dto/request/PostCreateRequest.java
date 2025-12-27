package com.example.loglog.dto.request;

import com.example.loglog.dto.type.PostStatus;
import com.example.loglog.entity.Category;
import com.example.loglog.entity.Post;
import com.example.loglog.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostCreateRequest {

    @NotBlank(message = "제목은 필수입니다.")
    private String title;

    @NotBlank(message = "본문은 필수입니다.")
    private String content;

    @NotNull(message = "카테고리를 선택해주세요.")
    private Long categoryId;

    private String thumbnailUrl;

    @NotNull(message = "상태값(임시/발행/비밀글)은 필수입니다.")
    private PostStatus status;

    private List<String> tags;

    public Post toEntity(User user, Category category) {
        return Post.builder()
                .user(user)
                .category(category)
                .title(this.title)
                .content(this.content)
                .thumbnailUrl(this.thumbnailUrl)
                .status(this.status)
                .views(0L)
                .build();
    }
}