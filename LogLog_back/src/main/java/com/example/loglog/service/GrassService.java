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

    /* =========================
       최근 1년 (오늘 포함)
       ========================= */
    public List<GrassResponse> getGrassRecent(Long ownerId, Long viewerId) {

        boolean isOwner = viewerId != null && ownerId.equals(viewerId);

        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(364);

        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay(); // end exclusive

        return isOwner
                ? toGrassResponses(
                logRepository.countDailyActivitiesBetween(ownerId, start, end)
        )
                : toGrassResponses(
                logRepository.countDailyPublicActivitiesBetween(ownerId, start, end)
        );
    }

    /* =========================
       연도별 잔디
       ========================= */
    public List<GrassResponse> getGrassByYear(Long ownerId, Long viewerId, int year) {

        boolean isOwner = viewerId != null && ownerId.equals(viewerId);

        LocalDateTime start = LocalDate.of(year, 1, 1).atStartOfDay();
        LocalDateTime end = LocalDate.of(year + 1, 1, 1).atStartOfDay();

        return isOwner
                ? toGrassResponses(
                logRepository.countDailyActivitiesBetween(ownerId, start, end)
        )
                : toGrassResponses(
                logRepository.countDailyPublicActivitiesBetween(ownerId, start, end)
        );
    }

    /* =========================
       연도 목록
       ========================= */
    public List<Integer> getGrassYears(Long userId) {
        return logRepository.findActivityYears(userId)
                .stream()
                .map(Number::intValue)
                .toList();
    }

    /* =========================
       row → DTO 변환만 담당
       ========================= */
    private List<GrassResponse> toGrassResponses(List<Object[]> rows) {
        return rows.stream()
                .map(row -> new GrassResponse(
                        ((java.sql.Timestamp) row[0])
                                .toLocalDateTime()
                                .toLocalDate(),
                        ((Number) row[1]).longValue()
                ))
                .toList();
    }

    // TODO: 추후 프론트 단순화를 위해 빈 날짜 0 채우기 고려
}
