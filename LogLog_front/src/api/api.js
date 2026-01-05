import axios from "axios";
import { logout, getToken } from "./authApi";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

// 요청 interceper 
// 서버로 나가는 모든 요청에 Jwt 자동 추가 
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    } else {
        config.headers['Content-Type'] = 'application/json';
    }
  return config; // 수정된 설정 반환
});


// 응답 intercepter
api.interceptors.response.use(
  (response) => response, // 성공
  (error) => {
    if (error.response?.status === 401) {
      logout();
      if (!window.location.pathname.includes('/auth/login')) {
        window.location.href = '/auth/login'; // 401 은 인증 싪 -> 새로고침으로 초기화 
      }

    }

    return Promise.reject(error);
  }
);