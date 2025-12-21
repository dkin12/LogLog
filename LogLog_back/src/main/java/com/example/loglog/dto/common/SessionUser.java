package com.example.loglog.dto.common;

import com.example.loglog.entity.User;
import lombok.Getter;

@Getter
public class SessionUser {
    private Long userId;
    private String nickname;
    private String email;

    public SessionUser(User user) {
        this.userId = user.getId();
        this.nickname = user.getNickname();
        this.email = user.getEmail();
    }
}