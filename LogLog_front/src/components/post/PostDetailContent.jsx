import React, { useState, useRef, useEffect } from 'react';
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import '../../css/PostDetailContent.css';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { deletePosts } from '../../api/postsApi';
import { fetchComments, createComment, deleteComment, updateComment } from '../../api/commentApi';
import { useToast } from '../../hooks/useToast';

const PostDetailContent = ({ post, currentUser }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const toast = useToast();
    const commentRefs = useRef({});

    const [commentInput, setCommentInput] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [lastCreatedCommentId, setLastCreatedCommentId] = useState(null);

    if (!post || !post.content) return null;

    const isOwner = currentUser && currentUser.id === post.userId;

    const {
        data: comments = [],
        refetch: refetchComments,
    } = useQuery({
        queryKey: ['comments', post.id],
        queryFn: () => fetchComments(post.id),
        enabled: !!post?.id,
    });

    useEffect(() => {
        if (!lastCreatedCommentId) return;

        const target = commentRefs.current[lastCreatedCommentId];
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [comments, lastCreatedCommentId]);

    // 게시글 삭제
    const deletePostMutation = useMutation({
        mutationFn: () => deletePosts(post.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['log_posts'] });
            toast.success('게시글이 삭제되었습니다.');
            navigate('/', { replace: true });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    // 댓글 작성
    const createCommentMutation = useMutation({
        mutationFn: (payload) => createComment(post.id, payload),
        onSuccess: (createdCommentId) => {
            setCommentInput('');
            setLastCreatedCommentId(createdCommentId);
            refetchComments();
        },
        onError: () => {
            toast.error('댓글 작성에 실패했습니다.');
        },
    });

    // 댓글 수정
    const updateCommentMutation = useMutation({
        mutationFn: ({ commentId, content }) =>
            updateComment(commentId, { content }),
        onSuccess: () => {
            setEditingCommentId(null);
            setEditContent('');
            refetchComments();
        },
        onError: () => {
            toast.error('댓글 수정에 실패했습니다.');
        },
    });

    // 댓글 삭제
    const deleteCommentMutation = useMutation({
        mutationFn: (commentId) => deleteComment(commentId),
        onSuccess: () => {
            refetchComments();
        },
        onError: () => {
            toast.error('댓글 삭제에 실패했습니다.');
        },
    });

    /* ================= 핸들러 ================= */

    const handleCreateComment = () => {
        if (!commentInput.trim()) return;
        createCommentMutation.mutate({ content: commentInput });
    };

    const handleDeleteComment = (commentId) => {
        if (window.confirm('댓글을 삭제하시겠습니까?')) {
            deleteCommentMutation.mutate(commentId);
        }
    };

    const handleHistoryClick = async () => {
        await queryClient.invalidateQueries({
            queryKey: ['log_posts_history', post.id],
        });
        navigate(`/posts/${post.id}/history`);
    };

    const handleTagClick = (tagName) => {
        const cleanTagName = tagName.startsWith('#')
            ? tagName.substring(1)
            : tagName;
        navigate(`/?tag=${encodeURIComponent(cleanTagName.trim())}`);
    };

    return (
        <div className="post-detail-container">
            {/* 게시글 헤더 */}
            <div className="post-header">
                <h1 className="post-title">{post.title}</h1>

                <div className="post-meta">
                    <div className="post-info">
                        <span style={{ fontWeight: 'bold' }}>
                            {post.userNickname}
                        </span>
                        <span style={{ color: '#ccc' }}>|</span>
                        <span>
                            {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                    </div>

                    {isOwner && (
                        <div className="post-actions">
                            <button
                                className="btn-history"
                                onClick={handleHistoryClick}
                            >
                                내역
                            </button>
                            <button
                                className="btn-update"
                                onClick={() =>
                                    navigate(`/posts/write/${post.id}/edit`)
                                }
                            >
                                수정
                            </button>
                            <button
                                className="btn-delete"
                                onClick={() => {
                                    if (window.confirm('삭제하시겠습니까?')) {
                                        deletePostMutation.mutate();
                                    }
                                }}
                            >
                                삭제
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 게시글 본문 */}
            <div className="post-content">
                <Viewer initialValue={post.content} key={post.content} />
            </div>

            {/* 태그 */}
            <div className="tag-list">
                {post.tags.map((tag, index) => (
                    <span
                        key={index}
                        className="tag-item"
                        onClick={() => handleTagClick(tag)}
                    >
                        #{tag}
                    </span>
                ))}
            </div>

            {/* ================= 댓글 영역 ================= */}
            <div className="comment-section">
                <h3 className="comment-count">
                    {comments.length}개의 댓글
                </h3>

                {/* 댓글 작성 (로그인한 경우만 노출) */}
                {currentUser && (
                    <div className="comment-input-wrapper">
                        <textarea
                            className="comment-textarea"
                            placeholder="댓글을 작성하세요."
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                        />
                        <div className="comment-btn-wrapper">
                            <button
                                className="btn-submit-comment"
                                disabled={!commentInput.trim()}
                                onClick={handleCreateComment}
                            >
                                댓글 작성
                            </button>
                        </div>
                    </div>
                )}

                {/* 댓글 목록 */}
                <div className="comment-list">
                    {comments.length === 0 && (
                        <div className="comment-empty">
                            아직 댓글이 없습니다.
                        </div>
                    )}

                    {comments.map((comment) => {
                        const isMyComment = currentUser?.id === comment.userId;

                        return (
                            <div
                                className="comment-item"
                                key={comment.id}
                                ref={(el) => {
                                    if (el) commentRefs.current[comment.id] = el;
                                }}
                            >
                                <div className="comment-header">
                                    <div className="comment-info">
                    <span className="comment-user">
                        {comment.nickname}
                    </span>
                                        <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                                    </div>

                                    {isMyComment && (
                                        <div className="comment-actions">
                                            {editingCommentId === comment.id ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateCommentMutation.mutate({
                                                                commentId: comment.id,
                                                                content: editContent,
                                                            })
                                                        }
                                                    >
                                                        저장
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingCommentId(null);
                                                            setEditContent('');
                                                        }}
                                                    >
                                                        취소
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingCommentId(comment.id);
                                                            setEditContent(comment.content);
                                                        }}
                                                    >
                                                        수정
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                    >
                                                        삭제
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="comment-text">
                                    {editingCommentId === comment.id ? (
                                        <textarea
                                            className="comment-textarea edit"
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                        />
                                    ) : (
                                        comment.content
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PostDetailContent;
