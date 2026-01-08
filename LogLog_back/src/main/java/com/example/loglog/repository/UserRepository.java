package com.example.loglog.repository;

import com.example.loglog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * 이메일을 기준으로 사용자를 조회.
     * JpaRepository가 메서드 이름을 분석하여 자동으로 SQL을 생성
     *
     * @param email
     * @return Optional<User>
     */
    Optional<User> findByEmail(String email);

    /**
     * (신규) 회원가입 시 이메일 중복 체크
     *
     * @param email
     * @return 이메일이 존재하면 true, 아니면 false
     */
    boolean existsByEmail(String email);

    /**
     * (신규) 회원가입 시 닉네임 중복 체크
     *
     * @param nickname
     * @return 닉네임이 존재하면 true, 아니면 false
     */
    boolean existsByNickname(String nickname);

    /**
     * (신규) OAuth2 로그인 사용자 조회
     * provider와 providerId 조합으로 사용자를 식별
     *
     * @param provider
     * @param providerId
     * @return Optional<User>
     */
    Optional<User> findByProviderAndProviderId(String provider, String providerId);

}
