import React from 'react';
import '../css/PostHistory.css';
import { useQuery } from "@tanstack/react-query";
import { getPostsHistories } from "../api/postsApi.js";
import { useParams } from 'react-router-dom';
import PostHistoryItem from '../components/post/PostHistoryItem.jsx';
import EmptyState from "../components/post/EmptyState.jsx";
import {useNavigate} from "react-router";

function PostHistory() {
    const { id } = useParams();
    const postId = Number(id);

    // .env 파일에서 가져온 API 베이스 주소
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';
    const navigate = useNavigate();
    const { data: posts = [], isLoading, isError } = useQuery({
        queryKey: ['log_posts_history', postId],
        queryFn: () => getPostsHistories(postId),
        enabled: !!postId
    });

    if (isLoading) return <div className="loading">데이터 로딩 중...</div>;
    if (isError) return <div className="error">데이터를 불러오는데 실패했습니다.</div>;

    return (
        <div className="layout-content">
            <div className="post-history-container">
                <div className="post-history-header">
                    <h2 className="post-history-header-title">バージョン</h2>
                    <p className="post-count-text">총 {posts.length} 건</p>
                </div>

                <div className="post-list-wrapper"
                     onClick={() => navigate(``)}
                >
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <PostHistoryItem
                                key={post.historyId}
                                post={post}
                                apiBase={apiBase}
                            />
                        ))
                    ) : (
                        <EmptyState message="수정내역이 없습니다." />
                    )}
                </div>
            </div>
        </div>
    );
}

export default PostHistory;