package com.example.loglog.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSignupRequest {
    private String email;
    private String password;
    private String passwordConfirm;
    private String nickname;
}