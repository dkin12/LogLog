import api from "./axios";

export const fetchPosts = async ({ page, categoryId, keyword, tag }) => {
    const params = {
        page: page + 1,
        size: 10,
    };

    if (categoryId) params.categoryId = categoryId;
    if (keyword) params.keyword = keyword;
    if (tag) params.tag = tag;

    const res = await api.get("/api/posts", { params });
    return res.data;
};
