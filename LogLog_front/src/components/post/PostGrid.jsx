import PostCard from "./PostCard";
import "./PostGrid.css"

export default function PostGrid({ posts }) {
    if (!posts || posts.length === 0) {
        return <div className="empty-state">게시글이 없습니다.</div>;
    }
// 이미지 경로 설정
    const apiBase = import.meta.env.VITE_API_BASE_URL;
    return (
        <div className="post-grid">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} apiBase={apiBase} />
            ))}
        </div>
    );
}
