package com.example.loglog.entity;

import com.example.loglog.dto.type.PostStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "log_post_history") // 히스토리 전용 테이블
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private Long id;

    // ★ 어떤 게시글의 기록인지 연결 (Post가 삭제되면 히스토리도 지울지, 남길지는 정책 나름인데 보통 연결해둡니다)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "posts_id", nullable = false)
    private Post post;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(length = 200)
    private String title;

    @Column(columnDefinition = "CLOB")
    private String content;

    @Column(name = "thumbnail_url", length = 200)
    private String thumbnailUrl;

    @Column(name = "category_id")
    private Long categoryId;

    @Enumerated(EnumType.STRING)
    private PostStatus status;

    @CreationTimestamp
    @Column(name = "archived_at", updatable = false)
    private LocalDateTime archivedAt;
}