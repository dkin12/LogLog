import PostGrid from "./PostGrid";

export default function PostList({ posts, isLoading, isError }) {
    if (isLoading) {
        return <div className="loading">로딩 중...</div>;
    }

    if (isError) {
        return <div className="error">게시글을 불러오지 못했습니다.</div>;
    }

    if (!posts || posts.length === 0) {
        return <div className="empty-state">게시글이 없습니다.</div>;
    }

    return <PostGrid posts={posts} />;
}
