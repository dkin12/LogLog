import api from "./axios";

export const fetchPosts = async ({ page, category }) => {
    const params = {
        page: page + 1,
        size: 10,
    };

    if (category && category !== "전체") {
        params.keyword = category;
    }

    const res = await api.get("/api/posts", { params });
    return res.data;
};