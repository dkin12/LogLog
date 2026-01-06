package com.example.loglog.dto.response;

import com.example.loglog.dto.type.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class MyCommentResponse {

    // 댓글 정보
    private Long commentId;
    private String content;
    private LocalDateTime createdAt;

    // 게시글 정보
    private Long postId;
    private String postTitle;
    private String categoryName;
    private PostStatus postStatus; // PUBLISHED / PRIVATE
}
