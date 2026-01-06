import api from "./axios";

/**
 * 로그인 요청
 * @param {{ email: string, password: string }}
 */
export const login = async (data) => {
    const response = await api.post("/api/users/login", data);
    return response.data; // SessionUser 반환
};

/**
 * 회원가입 요청
 * @param {{ email: string, password: string, nickname: string }}
 */
export const signup = async (data) => {
    const response = await api.post("/api/users/signup", data);
    return response.data;
};

/**
 * 로그아웃 요청
 */
export const logout = async () => {
    await api.post("/api/users/logout");
};

/**
 * 로그인 사용자 정보 조회 (세션 체크)
 */
export const getMe = async () => {
    const response = await api.get("/api/users/me");
    return response.data;
};

export const getToken = () => {
    return localStorage.getItem('accessToken');
};