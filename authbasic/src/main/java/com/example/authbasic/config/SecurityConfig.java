package com.example.authbasic.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http)  {
        http
                // 브라우저 세션 기반 로그인 시 사용
                .csrf(csrf -> csrf.disable())
                // 인가. 권한 검사
                .authorizeHttpRequests(auth->auth
                        // GET 조회는 누구나 통과
                        .requestMatchers(HttpMethod.GET,"/api/auth").permitAll()
                        // POST 작성으로 로그인을 해야 통과
                        .requestMatchers(HttpMethod.POST,"/api/auth").authenticated()
                        // DELETE 삭제 관리자 admin 만 통과
                        .requestMatchers(HttpMethod.DELETE,"/api/auth/*").hasRole("ADMIN")
                        // 나머지 메서드는 전부 로그인 필요
                        .anyRequest().authenticated())
                // 테스트를 위해 사용. 요청 헤더에 Authorization : Basic ...
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
    // 401 로그인 안한거
    // 403 권한이 없는거
    @Bean
    UserDetailsService userDetailsService(PasswordEncoder encoder) {
        UserDetails user = User.withUsername("user")
                .password(encoder.encode("1234"))
                .roles("USER")
                .build();
        UserDetails admin = User.withUsername("admin")
                .password(encoder.encode("1234"))
                .roles("ADMIN")
                .build();
        return new InMemoryUserDetailsManager(user, admin);
    }


    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
