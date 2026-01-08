import React from 'react';
import './PostHistory.css';
import { useQuery } from "@tanstack/react-query";
import { getPostsHistories, detailPost } from "../../api/postsApi.js";
import { useParams, useNavigate } from 'react-router-dom';
import PostHistoryItem from './PostHistoryItem.jsx';

function PostHistory() {
    const { id } = useParams();
    const postId = Number(id);
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';
    const navigate = useNavigate();

    // 1. 수정 이력 목록
    const { data: posts = [], isLoading: isHistoryLoading } = useQuery({
        queryKey: ['log_posts_history', postId],
        queryFn: () => getPostsHistories(postId),
        enabled: !!postId
    });

    // 2. 현재 게시글 (최신본)
    const { data: currentPost, isLoading: isPostLoading } = useQuery({
        queryKey: ['post', postId],
        queryFn: () => detailPost(postId),
        enabled: !!postId
    });

    if (isHistoryLoading || isPostLoading) {
        return <div className="loading">데이터 로딩 중...</div>;
    }

    if (!currentPost) return null;

    // 변경 없는 이력 제거
    const filteredPosts = posts.filter(p =>
        p.content?.trim() !== currentPost.content?.trim()
    );

    return (
        <div className="layout-content page-scroll">
            <div className="post-history-container">
                <div className="post-history-header">
                    <h2 className="post-history-header-title">バ-ジョン</h2>
                    <p className="post-count-text">
                        총 <b>{filteredPosts.length}</b> 건의 수정 내역이 있습니다.
                    </p>
                </div>

                <div className="post-list-wrapper">
                    {filteredPosts.map((post) => (
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
