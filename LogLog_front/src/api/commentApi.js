import api from "./axios";

// 게시글 댓글 조회
export async function fetchComments(postId) {
    const res = await api.get(`/api/posts/${postId}/comments`);
    return res.data;
}

// 댓글 등록
export async function createComment(postId, payload) {
    const res = await api.post(`/api/posts/${postId}/comments`, payload);
    return res.data;
}

// 댓글 수정
export async function updateComment(commentId, payload) {
    await api.put(`/api/comments/${commentId}`, payload);
}

// 댓글 삭제
export async function deleteComment(commentId) {
    await api.delete(`/api/comments/${commentId}`);
}

// 마이페이지 - 내가 단 댓글
export async function fetchMyComments() {
    const res = await api.get('/api/mypage/comments');
    return res.data;
}
