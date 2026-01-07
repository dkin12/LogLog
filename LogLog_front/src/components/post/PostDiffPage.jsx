import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // 데이터를 가져오기 위해 필요
import { Viewer } from '@toast-ui/react-editor';
import { detailPost, getPostDetailHistories } from "../../api/postsApi.js"; // API 함수들
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import '../../css/PostDiffPage.css';

function PostDiffPage() {
    const { id, historyId } = useParams();
    const navigate = useNavigate();
    // 1. 현재 게시글(오른쪽 패널용) 데이터 가져오기
    const { data: currentPost, isLoading: isCurrentLoading } = useQuery({
        queryKey: ['post_current', id],
        queryFn: () => detailPost(id),
        enabled: !!id // id가 있을 때만 실행
    });

    // 2. 과거 히스토리(왼쪽 패널용) 데이터 가져오기
    const { data: historyPost, isLoading: isHistoryLoading } = useQuery({
        queryKey: ['post_history_detail', historyId],
        queryFn: () => getPostDetailHistories(historyId),
        enabled: !!historyId // historyId가 있을 때만 실행
    });

    // 로딩 처리
    if (isCurrentLoading || isHistoryLoading) return <div className="loading">데이터 로딩 중...</div>;

    return (
        <div className="layout-content page-scroll">
            <div className="diff-layout-container">
                <div className="diff-sticky-header">
                    <div className="header-left">
                        <h2 className="diff-main-title">{currentPost?.title}</h2>
                        <span className="diff-timestamp">
                            과거 기록 시점: {historyPost ? new Date(historyPost.archivedAt).toLocaleString() : "날짜 정보 없음"}
                        </span>
                    </div>
                    <button
                        className="btn-restore"
                        onClick={() => navigate(`/posts/write/${id}/restore`, {
                            state: { restoreHistoryId: historyId }
                        })}>
                        선택한 버전으로 수정하기
                    </button>
                </div>

                <div className="diff-content-wrapper">
                    <div className="diff-panel">
                        <div className="panel-label">과거 기록 버전</div>
                        <div className="viewer-box">
                            <h3 className="diff-sub-title">{historyPost?.title}</h3>
                            <div className="diff-divider" />
                            <Viewer initialValue={historyPost?.content || "내용이 없습니다."} />
                        </div>
                    </div>

                    <div className="diff-panel current-panel">
                        <div className="panel-label current">현재 발행된 버전 (최신)</div>
                        <div className="viewer-box">
                            <h3 className="diff-sub-title">{currentPost?.title}</h3>
                            <div className="diff-divider" />
                            <Viewer initialValue={currentPost?.content || "내용이 없습니다."} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostDiffPage;