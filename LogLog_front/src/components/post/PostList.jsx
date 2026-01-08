import PostGrid from "./PostGrid";
import PostCard from "./PostCard";
import EmptyState from "./EmptyState";

export default function PostList({posts = [], isLoading, isError}) {
    if (isLoading) {
        return <div className="loading">로딩 중...</div>;
    }

    if (isError) {
        return <div className="error">게시글을 불러오지 못했습니다.</div>;
    }

    const apiBase = import.meta.env.VITE_API_BASE_URL;

    return (
        <div className="post-list-wrapper">
            <PostGrid>
                {posts.length === 0 && (
                    <EmptyState message="작성된 글이 없습니다."/>
                )}

                {posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        apiBase={apiBase}
                    />
                ))}
            </PostGrid>
        </div>
    );
}
