import React from 'react';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";

function DraftsPage() {
    const queryClient = useQueryClient();

    // 1. 임시 저장 목록 조회 API 호출
    const { data: drafts = [], isLoading } = useQuery({
        queryKey: ['log_posts'],
        queryFn: async () => {
            const response = await axios.get('/api/posts/${postId}/drafts');
            return response.data;
        }
    });

    // 2. 삭제 로직
    const deleteMutation = useMutation({
        mutationFn: (postId) => axios.delete(`/api/posts/${postId}`),
        onSuccess: () => {
            alert('삭제되었습니다.');
            queryClient.invalidateQueries(['posts_drafts']);
        }
    });

    if (isLoading) return <div className="loading">로딩 중...</div>;

    return (
        <div className="draft-list-container">
            {/* 상단 헤더 섹션 */}
            <header className="draft-header">
                <h1 className="draft-title">一時保存</h1>
                <p className="draft-count">총 <strong>{drafts.length}</strong> 건</p>
            </header>

            {/* 목록 섹션 */}
            <div className="draft-items-wrapper">
                {drafts.length > 0 ? (
                    drafts.map((post) => (
                        <div key={post.id} className="draft-item">
                            <div className="draft-item-content">
                                <h2 className="item-title">{post.title}</h2>
                                <p className="item-summary">{post.summary}</p>
                                <div className="item-footer">
                                    <span className="item-date">{post.createdAt}</span>
                                    <button
                                        className="btn-delete"
                                        onClick={() => {
                                            if(window.confirm('삭제하시겠습니까?'))
                                                deleteMutation.mutate(post.id)
                                        }}>삭제
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-data">임시 저장된 게시글이 없습니다.</div>
                )}
            </div>
        </div>
    );
};

export default DraftsPage;