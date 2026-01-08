import api from "./axios";

/* 중복 체크 */
export const checkEmail = async (email) => {
    const res = await api.get("/api/users/exists/email", {
        params: {email},
    });
    return res.data;
};

export const checkNickname = async (nickname) => {
    const res = await api.get("/api/users/exists/nickname", {
        params: {nickname},
    });
    return res.data;
};

/* 내 정보 수정 */
export const updateNickname = async (nickname) => {
    const res = await api.patch("/api/users/me/nickname", {nickname});
    return res.data;
};

/* 타인 프로필 조회 */
export const getUserProfile = async (userId) => {
    const res = await api.get(`/api/users/${userId}`);
    return res.data;
};

/* 타인 공개 게시글 조회 */
export const getUserPosts = async (userId) => {
    const res = await api.get(`/api/users/${userId}/posts`);
    return res.data;
};
