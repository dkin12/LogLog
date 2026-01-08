package com.example.loglog.repository;

import com.example.loglog.dto.type.ActivityType;
import com.example.loglog.entity.Log;
import com.example.loglog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface LogRepository extends JpaRepository<Log, Long> {

    // 로그인 1일 1회 체크
    boolean existsByUserAndActivityTypeAndCreatedAtBetween(
            User user,
            ActivityType activityType,
            LocalDateTime start,
            LocalDateTime end
    );

    // 최근/연도 공용 (본인)
    @Query(value = """
        SELECT
            TRUNC(created_at),
            COUNT(*)
        FROM log_log
        WHERE user_id = :userId
          AND created_at >= :startDate
          AND created_at < :endDate
        GROUP BY TRUNC(created_at)
        ORDER BY TRUNC(created_at)
    """, nativeQuery = true)
    List<Object[]> countDailyActivitiesBetween(
            @Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // 타인 잔디 (공개 글 = POST_PUBLISH만)
    @Query(value = """
        SELECT
            TRUNC(created_at),
            COUNT(*)
        FROM log_log
        WHERE user_id = :userId
          AND activity_type = 'POST_PUBLISH'
          AND created_at >= :start
          AND created_at < :end
        GROUP BY TRUNC(created_at)
        ORDER BY TRUNC(created_at)
    """, nativeQuery = true)
    List<Object[]> countDailyPublicActivitiesBetween(
            @Param("userId") Long userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    // 연도 목록
    @Query(value = """
        SELECT DISTINCT EXTRACT(YEAR FROM created_at)
        FROM log_log
        WHERE user_id = :userId
        ORDER BY 1 DESC
    """, nativeQuery = true)
    List<Number> findActivityYears(@Param("userId") Long userId);
}
