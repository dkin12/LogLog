package com.example.loglog.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "log_users") // Oracle DB에 생성한 테이블 이름
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "log_users_seq_gen"
    )
    @SequenceGenerator(
            name = "log_users_seq_gen",
            sequenceName = "log_users_seq",
            allocationSize = 1
    )
    @Column(name = "user_id")
    private Long id;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "nickname", nullable = false, unique = true, length = 50)
    private String nickname;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "provider", length = 20)
    private String provider;   // LOCAL, GOOGLE, KAKAO, NAVER

    @Column(name = "provider_id", length = 100)
    private String providerId;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}