import { api } from './api';

export const fetchPosts = async ({ page, categoryId, keyword, tag }) => {
    const params = {
        page: page + 1,
        size: 8,
    };

    if (categoryId) params.categoryId = categoryId;
    if (keyword) params.keyword = keyword;
    if (tag) params.tag = tag;

    const res = await api.get("/api/posts", { params });
    return res.data;
};


// 게시글 작성
export async function createPosts(payload) {
    const res = await api.post('/api/posts', payload);
    return res.data;
}
// 게시글 상세
export async function detailPost(postId) {
    const res = await api.get(`/api/posts/${postId}`);
    return res.data;

}

// 게시글 수정 
export async function updatePosts(postId, postData) {
    const res = await api.put(`/api/posts/${postId}`, postData);
    return res.data;
}
// 게시글 삭제
export async function deletePosts(postId) {
    const res = await api.delete(`/api/posts/${postId}`);
    return res.data;
}

// 게시글 수정 내역
export async function getPostsHistories(postId) {
    const res = await api.get(`/api/posts/${postId}/history`);
    return res.data;
}

// 게시글 수정 내역 1개
export async function getPostDetailHistories(historyId) {
    const res = await api.get(`/api/posts/history/${historyId}`);
    return res.data;
}

export async function getPostDraftList(userId){
    const res = await api.get(`/api/posts/draft/${userId}`);
    return res.data;
}
