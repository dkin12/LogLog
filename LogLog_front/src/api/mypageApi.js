import { api } from './api';

// 내가 쓴 글
export const getMyPosts = async () => {
    const res = await api.get("/api/mypage/posts");
    return res.data;
};

// 내가 쓴 댓글
export const getMyComments = async () => {
    const res = await api.get("/api/mypage/comments");
    return res.data;
};

// 특정 유저의 게시글 조회
export const fetchMyComments = async () => {
    const res = await api.get('/mypage/comments');
    return res.data; // 지금 네가 찍은 JSON 그대로 옴
}

// 타인 잔디 - 최근 1년
export const fetchUserGrassRecent = async (userId) => {
    const res = await api.get(`/api/users/${userId}/grass/recent`);
    return res.data;
};

// 타인 잔디 - 특정 연도
export const fetchUserGrassByYear = async (userId, year) => {
    const res = await api.get(`/api/users/${userId}/grass?year=${year}`);
    return res.data;
};

// 타인 잔디 - 연도 목록
export const fetchUserGrassYears = async (userId) => {
    const res = await api.get(`/api/users/${userId}/grass/years`);
    return res.data;
};
