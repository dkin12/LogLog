package com.example.loglog.service;

import com.example.loglog.dto.request.UserLoginRequest;
import com.example.loglog.dto.request.UserSignupRequest;
import com.example.loglog.dto.response.UserResponse;
import com.example.loglog.entity.User;
import com.example.loglog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor // final이 붙은 필드의 생성자를 자동으로 만들어줌
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 로그인 로직
     * @param loginRequest (email, password)
     * @return 로그인 성공 시 SessionUser DTO, 실패 시 null
     */
    public User login(UserLoginRequest loginRequest) {

        // 1. 이메일로 사용자 조회
        Optional<User> optionalUser =
                userRepository.findByEmail(loginRequest.getEmail());

        // 2. 이메일 없음
        if (optionalUser.isEmpty()) {
            return null;
        }
        User user = optionalUser.get();

        // 3. 비밀번호 검증 (BCrypt)
        if (!passwordEncoder.matches(
                loginRequest.getPassword(),
                user.getPassword()
        )) {
            return null;
        }

        // 4. 로그인 성공 → User 엔티티 반환
        return user;
    }

    /**
     * OAuth 로그인 처리
     * (현재는 구조만 준비, 추후 OAuth2 연동 시 구현 예정)
     *
     * @param provider OAuth 제공자 (GOOGLE, KAKAO, NAVER)
     * @param providerId OAuth 제공자에서 내려준 고유 ID
     * @param email OAuth 제공자 이메일
     * @param nickname OAuth 제공자 닉네임
     * @return SessionUser
     */
    /*public SessionUser oauthLogin(
            String provider,
            String providerId,
            String email,
            String nickname
    ) {
        // TODO: OAuth2 연동 시 구현
        return null;
    }*/

    /**
     * 회원가입 로직
     * @param request (email, password, passwordConfirm, nickname)
     * @return 에러 메시지 키 (성공 시 null)
     */
    @Transactional
    public String signup(UserSignupRequest request) {

        // 1. 비밀번호 확인 일치 여부
        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            return "passwordMismatch"; // 비밀번호 불일치
        }

        // 2. 이메일 중복 확인
        if (userRepository.existsByEmail(request.getEmail())) {
            return "duplicateEmail"; // 이메일 중복
        }

        // 3. 닉네임 중복 확인
        if (userRepository.existsByNickname(request.getNickname())) {
            return "duplicateNickname"; // 닉네임 중복
        }

        // 4. 모든 검증 통과. User 엔티티 생성
        User newUser = new User();
        newUser.setEmail(request.getEmail());
        // 비밀번호 암호화 저장
        String encodedPassword =
                passwordEncoder.encode(request.getPassword());
        newUser.setPassword(encodedPassword);
        newUser.setNickname(request.getNickname());
        // (createdAt은 User 엔티티의 @PrePersist에 의해 자동 생성됨)

        // 5. DB에 저장
        userRepository.save(newUser);

        return null; // 회원가입 성공
    }

    // 이메일 중복 체크
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // 닉네임 중복 체크
    public boolean existsByNickname(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

    // 로그인 정보 받아오기
    public UserResponse findMe(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname()
        );
    }

    // 닉네임 수정
    @Transactional
    public UserResponse updateNickname(Long userId, String nickname) {
        User user = userRepository.findById(userId)
                .orElseThrow();

        user.updateNickname(nickname);
        return UserResponse.from(user);
    }

}