package com.example.loglog.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class NicknameUpdateRequest {

    @NotBlank(message = "닉네임은 비어 있을 수 없습니다.")
    @Size(min = 2, max = 10, message = "닉네임은 2~10자여야 합니다.")
    private String nickname;
}
