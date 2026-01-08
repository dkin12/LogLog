package com.example.loglog.dto.response;

import com.example.loglog.entity.PostHistory;
import lombok.*;

import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostHistoryResponse {

    private Long historyId;
    private Long postId;
    private Long userId;
    private String title;
    private String summery;
    private String content;
    private String thumbnailUrl;
    private Integer categoryId;
    private LocalDateTime archivedAt;

    public static PostHistoryResponse from(PostHistory postHistory) {
        Long postId = (postHistory.getPost() != null) ? postHistory.getPost().getId() : null;
        return PostHistoryResponse.builder()
                .historyId(postHistory.getId())
                .postId(postId)
                .userId(postHistory.getUserId())
                .title(postHistory.getTitle())
                .content(postHistory.getContent())
                .categoryId(postHistory.getCategoryId())
                .summery(makeSummary(postHistory.getContent(), 150))
                .thumbnailUrl(postHistory.getThumbnailUrl())
                .archivedAt(postHistory.getArchivedAt())
                .build();
    }

    private static String makeSummary(String content, int limit) {
        if (content == null || content.isEmpty()) {
            return "";
        }

        String plainText = content;

        // 1. 코드 블록 제거 (``` ... ```) - 내용까지 삭제하고 싶으면 이 줄 유지
        plainText = plainText.replaceAll("(?s)```.*?```", "");

        // 2. 인라인 코드 제거 (`code`) -> code만 남김
        plainText = plainText.replaceAll("`([^`]+)`", "$1");

        // 3. 이미지 제거 (![alt](url)) -> alt 텍스트만 남김 (선택사항)
        plainText = plainText.replaceAll("!\\[(.*?)\\]\\(.*?\\)", "$1");

        // 4. 링크 제거 ([text](url)) -> text만 남김
        plainText = plainText.replaceAll("\\[(.*?)\\]\\(.*?\\)", "$1");

        // 5. 헤더 제거 (#, ##, ### 등)
        plainText = plainText.replaceAll("(?m)^#{1,6}\\s+", "");

        // 6. 강조 제거 (**bold**, __bold__, ~~strike~~)
        plainText = plainText.replaceAll("(\\*\\*|__|~~)(.*?)\\1", "$2"); // 굵게, 취소선
        plainText = plainText.replaceAll("(\\*|_)(.*?)\\1", "$2");       // 기울임

        // 7. 인용문(>) 및 리스트(-, *, +, 1.) 제거
        plainText = plainText.replaceAll("(?m)^\\s*>\\s+", "");          // 인용문
        plainText = plainText.replaceAll("(?m)^\\s*[-+*]\\s+", "");      // 언오더 리스트
        plainText = plainText.replaceAll("(?m)^\\s*\\d+\\.\\s+", "");    // 오더 리스트

        // 8. 체크박스 제거 ([ ], [x])
        plainText = plainText.replaceAll("\\[[ xX]\\]", "");

        // 9. 수평선 제거 (---, ***)
        plainText = plainText.replaceAll("(?m)^\\s*[-*_]{3,}\\s*$", "");

        // 10. 테이블 처리 (| 헤더 |) -> 파이프(|)를 공백으로 변경 및 구분선 제거
        plainText = plainText.replaceAll("\\|", " ");                    // | -> 공백
        plainText = plainText.replaceAll("(?m)^\\s*[-: ]+\\s*$", "");    // |---| 구분선 제거

        // 11. HTML 태그 제거 (필요 시)
        plainText = plainText.replaceAll("<[^>]+>", "");

        // 12. 최종 정리 (줄바꿈을 공백으로, 다중 공백을 하나로)
        plainText = plainText.replaceAll("\n", " ")
                .replaceAll("\\s+", " ")
                .trim();

        return plainText;
    }

}
