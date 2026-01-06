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

    // 잔디 집계 (연도 / 최근 1년 공용)
    @Query(value = """
            SELECT
                TRUNC(created_at),
                COUNT(*)
            FROM log_log
            WHERE user_id = :userId
              AND created_at BETWEEN :startDate AND :endDate
            GROUP BY TRUNC(created_at)
            ORDER BY TRUNC(created_at)
        """,
            nativeQuery = true
    )
    List<Object[]> countDailyActivitiesBetween(
            @Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // 잔디 연도 목록
    @Query(
            value = """
            SELECT DISTINCT EXTRACT(YEAR FROM created_at) AS y
            FROM log_log
            WHERE user_id = :userId
            ORDER BY y DESC
        """,
            nativeQuery = true
    )
    List<Number> findActivityYears(@Param("userId") Long userId);
}
