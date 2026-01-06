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
@Transactional(readOnly = true)
public class GrassService {

    private final LogRepository logRepository;

    // 연도별 잔디
    public List<GrassResponse> getGrassByYear(Long userId, int year) {
        LocalDateTime start = LocalDate.of(year, 1, 1).atStartOfDay();
        LocalDateTime end = LocalDate.of(year + 1, 1, 1).atStartOfDay();

        return toGrassResponses(
                logRepository.countDailyActivitiesBetween(userId, start, end)
        );
    }

    // 기본 화면: 오늘 포함 최근 365일
    public List<GrassResponse> getGrassRecent(Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(364);

        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        return toGrassResponses(
                logRepository.countDailyActivitiesBetween(userId, start, end)
        );
    }

    // 잔디가 존재하는 연도 목록
    public List<Integer> getGrassYears(Long userId) {
        return logRepository.findActivityYears(userId)
                .stream()
                .map(Number::intValue)
                .toList();
    }

    private List<GrassResponse> toGrassResponses(List<Object[]> rows) {
        return rows.stream()
                .map(row -> {
                    LocalDate date =
                            ((java.sql.Timestamp) row[0])
                                    .toLocalDateTime()
                                    .toLocalDate();

                    long count = ((Number) row[1]).longValue();
                    return new GrassResponse(date, count);
                })
                .toList();
    }
}
