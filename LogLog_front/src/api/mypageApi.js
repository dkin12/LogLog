import {api} from './api';

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

// 특정 유저의 댓글 조회
export const fetchMyComments = async () => {
    const res = await api.get('/mypage/comments');
    return res.data;
}

// 내 잔디
export const fetchMyGrassRecent = async () => {
    const res = await api.get(`/api/mypage/grass/recent`);
    return res.data;
};

export const fetchMyGrassByYear = async (year) => {
    const res = await api.get(`/api/mypage/grass?year=${year}`);
    return res.data;
};

export const fetchMyGrassYears = async () => {
    const res = await api.get(`/api/mypage/grass/years`);
    return res.data;
};
