package com.example.loglog.dto.response;

import com.example.loglog.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class MyCommentResponse {

    private Long commentId;
    private String content;
    private LocalDateTime createdAt;

    private Long postId;
    private String postTitle;

    public static MyCommentResponse from(Comment comment) {
        return new MyCommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getPost().getId(),
                comment.getPost().getTitle()
        );
    }
}
