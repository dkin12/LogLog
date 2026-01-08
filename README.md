# 🪵 LogLog

> 기록이 쌓일수록 성장의 흔적이 보이는 다이어리 서비스

LogLog는 개발자 및 취업 준비생 등 다양한 유저가  
자신의 **학습·회고 기록을 남기고, 수정 이력을 비교(diff)하며  
GitHub 잔디처럼 활동을 시각적으로 확인할 수 있는 블로그 플랫폼**입니다.

<br/><br/>

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 🔐 **OAuth 로그인** | Google OAuth2 기반 로그인 / JWT 인증 |
| 📝 **게시글 관리** | 게시글 작성 · 수정 · 삭제 · 임시저장 |
| 🕓 **수정 이력(diff)** | 글 수정 전/후 비교 화면 제공 |
| 🗂 **카테고리 분류** | 8개 카테고리 기반 게시글 필터링 |
| 🏷 **태그 시스템** | 게시글–태그 다대다 관계 관리 |
| 💬 **댓글** | 게시글 댓글 작성 |
| 🌱 **잔디** | GitHub 잔디 형태로 사용자 활동 시각화 |

<br/>


## 🛠 기술 스택

### Backend
- Java 17  
- Spring Boot 4.x  
- Spring Security + JWT  
- Spring Data JPA (Hibernate)  
- Oracle Database 21c XE  

### Frontend
- React 18 + Vite  
- React Router  
- TanStack Query  
- Axios  
- Framer Motion

<br/>


## 🗄 ERD 핵심 테이블

- User  
- Post  
- PostHistory  
- Tag  
- PostTag  
- Comment  
- Log (잔디 기록)

<br/>

## 🧠 설계 포인트

### ✏️ 수정 이력(diff)

- 게시글 수정 시 이전 버전을 `log_post_history` 테이블에 저장  
- 변경 전/후 텍스트를 비교하는 diff 화면 제공

### 🌱 잔디 시각화

- 게시글 작성 / 로그인 시 `log_log` 테이블에 활동 기록 저장  
- 사용자별 날짜 기반 히트맵 시각화

<br/>

## 🚀 실행 방법

### Backend

프로젝트 루트에서 애플리케이션 메인 클래스를 실행하면 서버가 기동됩니다.

### Frontend

```bash
npm install
npm run dev
```
