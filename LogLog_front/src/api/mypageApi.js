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

