import PostGrid from "./PostGrid";
import EmptyState from "./EmptyState.jsx";

export default function PostList({ posts, isLoading, isError }) {
    if (isLoading) {
        return <div className="loading">로딩 중...</div>;
    }

    if (isError) {
        return <div className="error">게시글을 불러오지 못했습니다.</div>;
    }

    if (!posts || posts.length === 0) {
        return <EmptyState message="작성된 글이 없습니다." />;
    }

    return <PostGrid posts={posts} />;
}
