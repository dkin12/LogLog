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

// 특정 유저의 공개 게시글 조회 (비밀글 제외)
export async function getUserPosts(userId) {
    const res = await api.get(`/api/users/${userId}/posts`);
    return res.data;
}
