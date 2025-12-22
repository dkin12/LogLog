package com.example.loglog.controller;

import com.example.loglog.dto.common.SessionUser;
import com.example.loglog.dto.request.UserLoginRequest;
import com.example.loglog.dto.request.UserSignupRequest;
import com.example.loglog.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    /**
     * 로그인 요청 처리
     *
     * 로그인 검증을 수행 후, 성공 시 세션에 사용자 정보를 저장
     *
     * @param request 로그인 요청 DTO (email, password)
     * @param session HttpSession (로그인 사용자 정보 저장용)
     * @return
     *  - 200 OK : 로그인 성공, SessionUser 반환
     *  - 401 UNAUTHORIZED : 이메일 또는 비밀번호 불일치
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody UserLoginRequest request,
            HttpSession session
    ) {
        SessionUser sessionUser = userService.login(request);

        if (sessionUser == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        // 로그인 성공 시 세션에 사용자 정보 저장
        session.setAttribute("loginUser", sessionUser);
        return ResponseEntity.ok(sessionUser);
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
            return ResponseEntity
                    .badRequest()
                    .body(error);
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

    /**
     * 로그아웃 요청을 처리
     *
     * 현재 세션을 무효화하여 로그인 상태를 해제한다.
     *
     * @param session HttpSession (현재 로그인 세션)
     * @return
     *  - 200 OK : 로그아웃 성공
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().build();
    }

    /**
     * 세션에 로그인 된 사용자 정보 반환
     *
     * React 애플리케이션 최초 로드 시 또는 새로고침 시, 로그인 상태 여부 확인
     *
     * @param session 현재 HTTP 세션
     * @return
     * session 현재 HTTP 세션
     */
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {

        SessionUser loginUser =
                (SessionUser) session.getAttribute("loginUser");

        if (loginUser == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        return ResponseEntity.ok(loginUser);
    }
}
