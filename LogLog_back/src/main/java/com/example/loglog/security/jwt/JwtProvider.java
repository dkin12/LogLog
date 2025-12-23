package com.example.loglog.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider {

    private final Key secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long TOKEN_VALID_TIME = 1000L * 60 * 60;

    /**
     * JWT 생성
     *
     * @param userId 사용자 ID (PK)
     * @param email  사용자 이메일
     * @return JWT 문자열
     */
    public String createToken(Long userId, String email) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + TOKEN_VALID_TIME);

        return Jwts.builder()
                .setSubject(String.valueOf(userId))   // sub: 사용자 식별자
                .claim("email", email)                 // 커스텀 클레임
                .setIssuedAt(now)                      // iat
                .setExpiration(expiry)                 // exp
                .signWith(secretKey)
                .compact();
    }

    /**
     * 토큰 유효성 검증
     *
     * @param token JWT
     * @return 유효하면 true, 아니면 false
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * JWT에서 Claims 추출
     */
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * 토큰에서 userId 추출
     */
    public Long getUserId(String token) {
        return Long.parseLong(getClaims(token).getSubject());
    }

    /**
     * 토큰에서 email 추출
     */
    public String getEmail(String token) {
        return getClaims(token).get("email", String.class);
    }
}
