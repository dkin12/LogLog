import React from 'react';
import defaultThumbnail from "../../assets/images/default.png";

const PostHistoryItem = ({ post, apiBase }) => {
    const thumbnail = post.thumbnailUrl ? `${apiBase}${post.thumbnailUrl}` : defaultThumbnail;

    return (
        <div className="post-history-item">
            <div className="post-thumbnail-box">
                <img src={thumbnail} alt="thumbnail" className="post-thumbnail-img" />
            </div>

            <div className="post-history-content-box">
                <span className="post-history-content-title">
                {new Date(post.archivedAt).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })}
                </span>
                <h3 className="post-history-title">{post.title}</h3>
                <p className="post-history-summery">
                    {post.summery}
                </p>
            </div>
        </div>
    );
};

export default PostHistoryItem;