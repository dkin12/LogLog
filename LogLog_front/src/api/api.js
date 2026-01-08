import axios from "axios";
import {logout, getToken} from "./authApi";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json', // 기본값 설정
    },
    withCredentials: true, // 쿠키 사용 시 필요 (JWT만 쓰면 false여도 됨)
});

// --- 요청 인터셉터 (Request) ---
api.interceptors.request.use((config) => {
    const token = getToken();

    // 1. 토큰이 있으면 헤더에 추가
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. [수정] Content-Type 자동 처리
    // FormData인 경우 Axios가 알아서 'multipart/form-data; boundary=...'를 붙여줍니다.
    // 우리가 수동으로 'Content-Type'을 지우거나 설정하면 boundary가 꼬일 수 있습니다.
    // 따라서 FormData일 때는 Content-Type 헤더 자체를 건드리지 않는 게 베스트입니다.
    if (config.data instanceof FormData) {
        // Axios가 알아서 하도록 내버려 둡니다 (헤더 덮어쓰기 방지)
        delete config.headers['Content-Type'];
    }

    return config;
});


// --- 응답 인터셉터 (Response) ---
api.interceptors.response.use(
    (response) => response, // 성공 시 그대로 반환
    (error) => {
        // 3. [수정] 401 에러 처리 (로그인 실패 상황 제외!)
        // error.config.url이 '/login'이 아닐 때만 튕겨내야 합니다.
        const isLoginRequest = error.config && error.config.url.includes('/login');

        if (error.response?.status === 401 && !isLoginRequest) {
            logout(); // 로컬 스토리지 비우기

            // 현재 페이지가 이미 로그인 페이지가 아닐 때만 이동
            if (!window.location.pathname.includes('/auth/login')) {
                alert('세션이 만료되었습니다. 다시 로그인해주세요.');
                window.location.href = '/auth/login';
            }
        }

        return Promise.reject(error);
    }
);