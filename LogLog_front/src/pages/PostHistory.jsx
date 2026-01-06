import React from 'react';
import '../css/PostHistory.css';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPostsHistories } from "../api/postsApi.js";
import { useParams, useNavigate } from 'react-router-dom';
import PostHistoryItem from '../components/post/PostHistoryItem.jsx';
import EmptyState from "../components/post/EmptyState.jsx";

function PostHistory() {
    const { id } = useParams();
    const postId = Number(id);
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: posts = [], isLoading, isError } = useQuery({
        queryKey: ['log_posts_history', postId],
        queryFn: () => getPostsHistories(postId),
        enabled: !!postId
    });

    if (isLoading) return <div className="loading">데이터 로딩 중...</div>;
    if (isError) return <div className="error">데이터를 불러오는데 실패했습니다.</div>;

    /**
     * 상세 내역(Diff) 페이지로 이동하는 핸들러
     * @param {Object} post - 현재 선택한 버전 객체
     * @param {string} oldContent - 비교를 위한 이전 버전의 본문
     */
    const handleItemClick = (post, oldContent) => {
        // 이동하기 전 최신 데이터를 보장하기 위해 캐시를 무효화할 수 있습니다.
        queryClient.invalidateQueries({ queryKey: ['post_history_detail', post.historyId] });

        navigate(`/posts/${postId}/history/${post.historyId}`, {
            state: {
                oldContent: oldContent // 다음 인덱스에서 가져온 이전 버전 본문
            }
        });
    };

    return (
        <div className="layout-content">
            <div className="post-history-container">
                <div className="post-history-header">
                    <h2 className="post-history-header-title">버전 기록</h2>
                    <p className="post-count-text">총 <b>{posts.length}</b> 건의 수정 내역이 있습니다.</p>
                </div>

                <div className="post-list-wrapper">
                    {posts.map((post, index) => {
                        // 이전 버전 찾기 (내림차순 정렬 기준)
                        const previousPost = posts[index + 1];
                        const oldContent = previousPost ? previousPost.content : "";

                        return (
                            <div
                                key={post.historyId}
                                className="post-item-card"
                                onClick={() => navigate(`/posts/${postId}/history/${post.historyId}`, {
                                    state: {
                                        oldContent: oldContent,        // 이전 버전 내용
                                        newContent: post.content,      // 선택한 버전의 내용 (추가)
                                        title: post.title,             // 제목 (추가)
                                        archivedAt: post.archivedAt    // 저장 시간 (추가)
                                    }
                                })}
                            >
                                <PostHistoryItem post={post} apiBase={apiBase} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default PostHistory;