import defaultThumbnail from "../../assets/images/default.png";
import { FaRegEye } from "react-icons/fa";
import { useNavigate } from "react-router";
import "./PostCard.css";

export default function PostCard({ post, apiBase }) {
    const navigate = useNavigate();

    const BASE_URL = apiBase || import.meta.env.VITE_API_BASE_URL;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const thumbnail = post.thumbnailUrl
        ? `${BASE_URL}${post.thumbnailUrl}`
        : defaultThumbnail;

    return (
        <div
            className="post-card"
            onClick={() => navigate(`/posts/${post.id}`)}
            style={{ cursor: "pointer" }}
        >
            <div className="post-card-thumbnail">
                <img src={thumbnail} alt="" />
            </div>

            <div className="post-card-content">
                <div className="post-card-header">
                    <div className="post-card-category">{post.categoryName}</div>
                    <div className="post-card-title">{post.title}</div>
                </div>

                <div className="post-card-summary">
                    {post.summary || "\u00A0"}
                </div>

                <div className="post-card-date">
                    {formatDate(post.createdAt)}
                </div>

                <div className="post-card-footer">
                    <span className="post-card-author">by {post.userNickname}</span>
                    <span className="post-card-views">
                        <FaRegEye /> {post.views}
                    </span>
                </div>
            </div>
        </div>
    );
}
