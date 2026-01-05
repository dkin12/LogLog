package com.example.loglog.dto.response;

import com.example.loglog.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MyPostResponse {

    private Long id;
    private String title;
    private String categoryName;
    private String createdAt;
    private String status;

    public static MyPostResponse from(Post post) {
        return new MyPostResponse(
                post.getId(),
                post.getTitle(),
                post.getCategory().getCategoryName(),
                post.getCreatedAt().toLocalDate().toString(),
                post.getStatus().name()
        );
    }
}
