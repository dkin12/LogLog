package com.example.loglog.dto.response;


// 게시글 리스트 응답

import com.example.loglog.entity.Category;
import com.example.loglog.entity.Post;
import com.example.loglog.entity.User;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostListResponse {

    private Long id;
    private String title;
    private String summary;
    private String userNickname;
    private String categoryName;
    private Long views;
    private String thumbnailUrl;
    private LocalDateTime createdAt;


    public static PostListResponse fromEntity(Post post) {
        return PostListResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .summary(makeSummary(post.getContent(),150))
                .thumbnailUrl(post.getThumbnailUrl())
                .userNickname(post.getUser().getNickname())
                .categoryName(post.getCategory().getCategoryName())
                .views(post.getViews())
                .createdAt(post.getCreatedAt())
                .build();
    }

    private static String makeSummary(String content, int limit){
        if(content == null || content.isEmpty()){
            return "";
        }
        // 마크다운 제거
        String plainText = content.replaceAll("[#*>\\[\\]`]", "") // 특수문자 제거
                .replaceAll("\n", " ");         // 줄바꿈 제거

        // 2. 글자 수 자르기
        if (plainText.length() > limit) {
            return plainText.substring(0, limit) + "...";
        }
        return plainText;

    }
}
