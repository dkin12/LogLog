package com.example.loglog.service;

import com.example.loglog.dto.type.ActivityType;
import com.example.loglog.entity.Log;
import com.example.loglog.entity.User;
import com.example.loglog.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class LogService {

    private final LogRepository logRepository;

    // 로그인 로그 (1일 1회)
    // @return - 200 OK : 로그인 성공 전 호출해서 이력 저장
    public void recordLogin(User user) {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        // 이미 오늘 로그인한 기록이 있으면 저장 X
        boolean alreadyLoggedToday =
                logRepository.existsByUserAndActivityTypeAndCreatedAtBetween(
                        user,
                        ActivityType.LOGIN,
                        start,
                        end
                );

        if (alreadyLoggedToday) return;

        logRepository.save(Log.login(user));
    }

    // 포스트 발행 로그
    // 발행 버튼 API에서만 호출할 것
    public void recordPostPublish(User user, Long postId) {
        logRepository.save(
                Log.postPublish(user, postId)
        );
    }
}
