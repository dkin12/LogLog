import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import '../../css/PostDiffPage.css';

function PostDiffPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // 리스트에서 넘겨받은 데이터
    const { oldContent, newContent, title, archivedAt } = location.state || {};

    if (!newContent) {
        return <div className="error-container">데이터를 찾을 수 없습니다.</div>;
    }

    return (
        <div className = "layout-content">
            <div className="diff-layout-container">
                {/* 상단 헤더 섹션 */}
                <div className="diff-sticky-header">
                    <div className="header-left">
                        <h2 className="diff-main-title">{title}</h2>
                        <span className="diff-timestamp">수정 일시: {new Date(archivedAt).toLocaleString()}</span>
                    </div>
                    <button className="btn-restore" onClick={() => navigate(-1)}>
                        이 버전으로 수정 시작
                    </button>
                </div>

                {/* 메인 비교 섹션 (옆으로 나란히) */}
                <div className="diff-content-wrapper">
                    <div className="diff-panel left-panel">
                        <div className="panel-label">이전 버전</div>
                        <div className="viewer-box">
                            <Viewer initialValue={oldContent || "내용이 없습니다."} />
                        </div>
                    </div>

                    <div className="diff-panel right-panel">
                        <div className="panel-label current">선택한 버전</div>
                        <div className="viewer-box">
                            <Viewer initialValue={newContent} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default PostDiffPage;