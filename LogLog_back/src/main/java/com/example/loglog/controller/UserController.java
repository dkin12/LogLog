package com.example.loglog.controller;

import com.example.loglog.dto.request.UserLoginRequest;
import com.example.loglog.dto.request.UserSignupRequest;
import com.example.loglog.dto.response.LoginResponse;
import com.example.loglog.entity.User;
import com.example.loglog.security.jwt.JwtProvider;
import com.example.loglog.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final JwtProvider jwtProvider;

    /**
     * 로그인 요청 처리
     *
     * 로그인 검증을 수행 후, 성공 시 세션에 사용자 정보를 저장
     *
     * @param request 로그인 요청 DTO (email, password)
     * @return
     *  - 200 OK : 로그인 성공, SessionUser 반환
     *  - 401 UNAUTHORIZED : 이메일 또는 비밀번호 불일치
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequest request) {
        User user = userService.login(request);

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        // 로그인 성공 → JWT 발급
        String token = jwtProvider.createToken(
                user.getId(),
                user.getEmail()
        );

        return ResponseEntity.ok(new LoginResponse(token));
    }

    /**
     * 회원가입 요청을 처리
     *
     * 이메일/닉네임 중복 여부 및 비밀번호 확인을 검증한 후, 사용자 생성
     *
     * @param request 회원가입 요청 DTO
     * @return
     *  - 201 CREATED : 회원가입 성공
     *  - 400 BAD REQUEST : 검증 실패 (중복 이메일, 닉네임, 비밀번호 불일치 등)
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserSignupRequest request) {
        String error = userService.signup(request);

        if (error != null) {
            return ResponseEntity.badRequest().body(error);
        }

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 이메일 중복 체크
    @GetMapping("/exists/email")
    public ResponseEntity<?> existsEmail(@RequestParam String email) {
        if (userService.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("이미 사용 중인 이메일입니다.");
        }
        return ResponseEntity.ok().build();
    }

    // 닉네임 중복 체크
    @GetMapping("/exists/nickname")
    public ResponseEntity<?> existsNickname(@RequestParam String nickname) {
        if (userService.existsByNickname(nickname)) {
            return ResponseEntity.badRequest().body("이미 사용 중인 닉네임입니다.");
        }
        return ResponseEntity.ok().build();
    }

    // 로그아웃
/*    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().build();
    }*/
}
