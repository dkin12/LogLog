import React from 'react';
import '../css/PostHistory.css';
import { useQuery } from "@tanstack/react-query";
// getPostDetail은 단일 게시글 정보를 가져오는 API 함수입니다 (이름은 프로젝트에 맞게 수정하세요)
import { getPostsHistories , detailPost} from "../api/postsApi.js";
import { useParams, useNavigate } from 'react-router-dom';
import PostHistoryItem from '../components/post/PostHistoryItem.jsx';

function PostHistory() {
    const { id } = useParams();
    const postId = Number(id);
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';
    const navigate = useNavigate();

    // 1. 히스토리 목록 가져오기
    const { data: posts = [], isLoading: isHistoryLoading } = useQuery({
        queryKey: ['log_posts_history', postId],
        queryFn: () => getPostsHistories(postId),
        enabled: !!postId
    });

    // 2. ⭐ 현재 발행 중인 최신 게시글 데이터 가져오기 (비교 대상)
    const { data: currentPost, isLoading: isPostLoading } = useQuery({
        queryKey: ['post', postId],
        queryFn: () => detailPost(postId), // 현재 최신 제목과 본문을 가져옴
        enabled: !!postId
    });
    console.log(currentPost);

    if (isHistoryLoading || isPostLoading) return <div className="loading">데이터 로딩 중...</div>;

    return (
        <div className="layout-content">
            <div className="post-history-container">
                <div className="post-history-header">
                    <h2 className="post-history-header-title">バ-ジョン</h2>
                    <p className="post-count-text">총 <b>{posts.length}</b> 건의 수정 내역이 있습니다.</p>
                </div>

                <div className="post-list-wrapper">
                    {posts.map((post) => (
                        <div
                            key={post.historyId}
                            className="post-item-card"
                            onClick={() => navigate(`/posts/${postId}/history/${post.historyId}`)}
                        >
                            <PostHistoryItem post={post} apiBase={apiBase} />
                        </div>

                    ))
                    }
                </div>
            </div>
        </div>
    );
}

export default PostHistory;