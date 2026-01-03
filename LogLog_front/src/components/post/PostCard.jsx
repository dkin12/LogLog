import defaultThumbnail from "../../assets/images/default.png";
import "./PostCard.css";

export default function PostCard({ post }) {
    const thumbnail = post.thumbnailUrl || defaultThumbnail;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    return (
        <div className="post-card">
            {/* 썸네일 영역 */}
            <div className="post-card-thumbnail">
                <img src={thumbnail} alt="" />
            </div>

            {/* 콘텐츠 영역 */}
            <div className="post-card-content">
                <div className="post-card-header">
                    <div className="post-card-category">
                        {post.categoryName}
                    </div>

                    <div className="post-card-title">
                        {post.title}
                    </div>
                </div>

                <div className="post-card-summary">
                    {post.summary}
                </div>

                <div className="post-card-date">
                    {formatDate(post.createdAt)}
                </div>

                <div className="post-card-footer">
                    <span className="post-card-author">by {post.userNickname}</span>
                    <span className="post-card-views">👁 {post.views}</span>
                </div>
            </div>
        </div>
    );
}
