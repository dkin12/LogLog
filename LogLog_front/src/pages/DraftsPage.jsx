import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPostDraftList, deletePosts } from "../api/postsApi.js";
import { toast } from "react-toastify";
import "../css/DraftPage.css";

function DraftsPage() {
    const { user } = useOutletContext();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // 임시저장 목록 조회
    const { data: items = [], isLoading } = useQuery({
        queryKey: ['post_drafts', user?.id],
        queryFn: async () => {
            const data = await getPostDraftList(user.id);
            return data.data || data;
        },
        enabled: !!user?.id,
    });

    // 삭제 기능
    const deletePostMutation = useMutation({
        mutationFn: (postId) => deletePosts(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['post_drafts'] });
            toast.success('임시저장 글이 삭제되었습니다.');
        },
        onError: (err) => {
            toast.error('삭제 실패: ' + err.message);
        }
    });

    const handleDeleteClick = (e, postId) => {
        e.stopPropagation(); // 부모 클릭(이동) 방지
        if (window.confirm("정말 삭제하시겠습니까?")) {
            deletePostMutation.mutate(postId);
        }
    };

    if (!user) return <div className="draft-loading">사용자 확인 중...</div>;
    if (isLoading) return <div className="draft-loading">목록을 불러오는 중...</div>;

    return (
        <div className = "layout-content">
            <div className="draft-page-container">
                {/* 상단 타이틀 영역 */}
                <div className="draft-header-section">
                    <h1 className="draft-main-title">一時保存</h1>
                </div>

                <div className="draft-content-wrapper">
                    {/* 총 건수 표시 */}
                    <p className="draft-count-label">총 {items.length} 건</p>

                    {/* 리스트 영역 */}
                    <div className="draft-list">
                        {items.length > 0 ? (
                            items.map((post) => (
                                <div
                                    key={post.postId || post.id}
                                    className="draft-item-row"
                                    onClick={() => navigate(`/posts/write/${post.postId || post.id}/draft`)}
                                >
                                    <h2 className="draft-item-title">
                                        {post.title || "제목 없는 문서"}
                                    </h2>

                                    <p className="draft-item-summary">
                                        {post.summary || "내용이 없습니다."}
                                    </p>

                                    <div className="draft-item-footer">
                                    <span className="draft-date">
                                        {post.createdAt
                                            ? new Date(post.createdAt).toLocaleDateString()
                                            : "날짜 정보 없음"}
                                    </span>

                                        <button
                                            className="btn-draft-delete"
                                            disabled={deletePostMutation.isPending}
                                            onClick={(e) => handleDeleteClick(e, post.postId || post.id)}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-data">임시 저장된 게시글이 없습니다.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
}

export default DraftsPage;