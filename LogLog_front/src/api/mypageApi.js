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
