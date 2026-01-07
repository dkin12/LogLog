import React from 'react';
import '../css/PostHistory.css';
import { useQuery } from "@tanstack/react-query";
import { getPostsHistories, detailPost } from "../api/postsApi.js";
import { useParams, useNavigate } from 'react-router-dom';
import PostHistoryItem from '../components/post/PostHistoryItem.jsx';

function PostHistory() {
    const { id } = useParams();
    const postId = Number(id);
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';
    const navigate = useNavigate();

    const { data: posts = [], isLoading: isHistoryLoading } = useQuery({
        queryKey: ['log_posts_history', postId],
        queryFn: () => getPostsHistories(postId),
        enabled: !!postId
    });

    const { isLoading: isPostLoading } = useQuery({
        queryKey: ['post', postId],
        queryFn: () => detailPost(postId),
        enabled: !!postId
    });

    if (isHistoryLoading || isPostLoading) {
        return <div className="loading">데이터 로딩 중...</div>;
    }

    return (
        <div className="layout-content page-scroll">
            <div className="post-history-container">
                <div className="post-history-header">
                    <h2 className="post-history-header-title">バ-ジョン</h2>
                    <p className="post-count-text">
                        총 <b>{posts.length}</b> 건의 수정 내역이 있습니다.
                    </p>
                </div>

                <div className="post-list-wrapper">
                    {posts.map((post) => (
                        <PostHistoryItem
                            key={post.historyId}
                            post={post}
                            apiBase={apiBase}
                            onClick={() =>
                                navigate(`/posts/${postId}/history/${post.historyId}`)
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PostHistory;