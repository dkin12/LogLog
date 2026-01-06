package com.example.loglog.service;

import com.example.loglog.dto.response.GrassResponse;
import com.example.loglog.dto.type.ActivityType;
import com.example.loglog.dto.type.PostStatus;
import com.example.loglog.entity.Log;
import com.example.loglog.entity.User;
import com.example.loglog.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LogService {
    private final LogRepository logRepository;

    // 로그인 로그
    public void recordLogin(User user) {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();          // 오늘 자정
        LocalDateTime end = today.plusDays(1).atStartOfDay(); // 내일 자정

        // 로그인 여부 판단
        boolean alreadyLoggedToday =
                logRepository.existsByUserAndActivityTypeAndCreatedAtBetween(
                        user,
                        ActivityType.LOGIN,
                        start,
                        end
                );

        if (alreadyLoggedToday) {
            return; // 오늘 이미 찍힘 → 아무 것도 안 함
        }

        // 최초 로그인이면 활동 저장
        logRepository.save(
                Log.builder()
                        .user(user)
                        .activityType(ActivityType.LOGIN)
                        .build()
        );
    }

    // 포스트 발행 로그
    public void recordPostPublish(
            User user,
            PostStatus oldStatus,
            PostStatus newStatus,
            Long postId
    ) {
        // 임시저장은 무조건 제외
        if (newStatus == PostStatus.DRAFT) {
            return;
        }
        // 첫 발행 (DRAFT → 발행 : 로그)
        if (oldStatus == PostStatus.DRAFT
                && (newStatus == PostStatus.PUBLISHED || newStatus == PostStatus.PRIVATE)) {

            logRepository.save(
                    Log.builder()
                            .user(user)
                            .activityType(ActivityType.POST_PUBLISH)
                            .postId(postId)
                            .build()
            );
            return;
        }
        // 수정 후 발행 (PUBLISHED / PRIVATE → 다시 발행)
        if ((oldStatus == PostStatus.PUBLISHED || oldStatus == PostStatus.PRIVATE)
                && (newStatus == PostStatus.PUBLISHED || newStatus == PostStatus.PRIVATE)) {

            logRepository.save(
                    Log.builder()
                            .user(user)
                            .activityType(ActivityType.POST_PUBLISH)
                            .postId(postId)
                            .build()
            );
        }
    }

    // 잔디 조회
    @Transactional(readOnly = true)
    public List<GrassResponse> getGrass(Long userId, int year) {

        LocalDateTime start =
                LocalDate.of(year, 1, 1).atStartOfDay();

        LocalDateTime end =
                LocalDate.of(year, 12, 31).atTime(23, 59, 59);

        return logRepository.countDailyActivities(
                        userId,
                        start,
                        end
                ).stream()
                .map(row -> {
                    LocalDate date =
                            ((Timestamp) row[0]).toLocalDateTime().toLocalDate();

                    long count =
                            ((Number) row[1]).longValue();

                    return new GrassResponse(date, count);
                })
                .toList();
    }

}
