package com.example.loglog.dto.type;

public enum ActivityType {
    LOGIN,         // 로그인 (1일 최초 1회만)
    POST_PUBLISH   // 포스트 발행 (첫 발행 + 수정 후 발행)
}
