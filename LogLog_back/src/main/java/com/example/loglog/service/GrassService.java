package com.example.loglog.service;

import com.example.loglog.dto.response.GrassResponse;
import com.example.loglog.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class GrassService {
    private final LogRepository logRepository;

    public List<GrassResponse> getGrassByYear(Long userId, int year) {
        LocalDateTime start = LocalDate.of(year, 1, 1).atStartOfDay();
        LocalDateTime end = LocalDate.of(year, 12, 31).atTime(23, 59, 59);

        return toGrassResponses(
                logRepository.countDailyActivitiesBetween(userId, start, end)
        );
    }

    // 잔디 기본 화면: 오늘 기준 최근 1년(365일)
    public List<GrassResponse> getGrassRecent(Long userId) {
        // 오늘 포함 365일: (today - 364) ~ today
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(364);

        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = today.atTime(23, 59, 59);

        return toGrassResponses(
                logRepository.countDailyActivitiesBetween(userId, start, end)
        );
    }

    public List<Integer> getGrassYears(Long userId) {
        return logRepository.findActivityYears(userId)
                .stream()
                .map(Number::intValue)
                .toList();
    }

    private List<GrassResponse> toGrassResponses(List<Object[]> rows) {
        return rows.stream()
                .map(row -> {
                    LocalDate date = ((java.sql.Timestamp) row[0])
                            .toLocalDateTime()
                            .toLocalDate();
                    long count = ((Number) row[1]).longValue();
                    return new GrassResponse(date, count);
                })
                .toList();
    }
}
