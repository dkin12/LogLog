package com.example.loglog.entity;

import com.example.loglog.dto.type.ActivityType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "log_log")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Log {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 활동한 사용자 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 활동 타입 */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ActivityType activityType;

    /** 관련 포스트 ID (LOGIN은 null) */
    @Column(name = "post_id")
    private Long postId;

    /** 활동 발생 시각 (잔디 날짜 기준) */
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 생성 메서드
    public static Log login(User user) {
        return Log.builder()
                .user(user)
                .activityType(ActivityType.LOGIN)
                .build();
    }

    public static Log postPublish(User user, Long postId) {
        return Log.builder()
                .user(user)
                .activityType(ActivityType.POST_PUBLISH)
                .postId(postId)
                .build();
    }
}
