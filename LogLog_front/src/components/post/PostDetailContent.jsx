import React, {useState, useRef, useEffect} from 'react';
import {Viewer} from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import './PostDetailContent.css';
import AuthorLink from '../common/AuthorLink';

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {useNavigate} from 'react-router';

import {deletePosts} from '../../api/postsApi';
import {
    fetchComments,
    createComment,
    deleteComment,
    updateComment,
} from '../../api/commentApi';
import {useToast} from '../../hooks/useToast';

const PostDetailContent = ({post, currentUser}) => {
    /* 훅은 최상단 */
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const toast = useToast();
    const commentRefs = useRef({});

    const [commentInput, setCommentInput] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [lastCreatedCommentId, setLastCreatedCommentId] = useState(null);

    const isOwner = currentUser?.id === post?.userId;

    /* 댓글 조회 */
    const {data: comments = [], refetch: refetchComments} = useQuery({
        queryKey: ['comments', post?.id],
        queryFn: () => fetchComments(post.id),
        enabled: !!post?.id, // post 없을 때 쿼리 실행 안 함
    });

    /* 자동 스크롤 */
    useEffect(() => {
        if (!lastCreatedCommentId) return;
        const target = commentRefs.current[lastCreatedCommentId];
        target?.scrollIntoView({behavior: 'smooth', block: 'center'});
    }, [comments, lastCreatedCommentId]);

    /* 게시글 삭제 */
    const deletePostMutation = useMutation({
        mutationFn: () => deletePosts(post.id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['log_posts'],
                refetchType: 'all'
            });
            toast.success('게시글이 삭제되었습니다.');
            navigate(-1);
        },
        onError: (e) => toast.error(e.message),
    });

    /* 댓글 작성 */
    const createCommentMutation = useMutation({
        mutationFn: (payload) => createComment(post.id, payload),
        onSuccess: (createdId) => {
            setCommentInput('');
            setLastCreatedCommentId(createdId);
            refetchComments();
        },
        onError: () => toast.error('댓글 작성에 실패했습니다.'),
    });

    /* 댓글 수정 */
    const updateCommentMutation = useMutation({
        mutationFn: ({commentId, content}) =>
            updateComment(commentId, {content}),
        onSuccess: () => {
            setEditingCommentId(null);
            setEditContent('');
            refetchComments();
        },
        onError: () => toast.error('댓글 수정에 실패했습니다.'),
    });

    /* 댓글 삭제 */
    const deleteCommentMutation = useMutation({
        mutationFn: deleteComment,
        onSuccess: () => refetchComments(),
        onError: () => toast.error('댓글 삭제에 실패했습니다.'),
    });

    /* 핸들러 */
    const handleCreateComment = () => {
        if (!commentInput.trim()) return;
        createCommentMutation.mutate({content: commentInput});
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

    const handleTagClick = (tag) => {
        const params = new URLSearchParams();
        params.set("tag", tag);

        navigate({
            pathname: "/posts",
            search: params.toString(),
        });
    };

    /* return은 훅 뒤 */
    if (!post || !post.content) {
        return null;
    }

    /* JSX */
    return (
        <div className="post-detail-container">
            {/* ===== 게시글 헤더 ===== */}
            <header className="post-header">
                <h1 className="post-title">{post.title}</h1>

                <div className="post-meta">
                    {post?.userId && (
                        <AuthorLink
                            userId={post.userId}
                            nickname={post.userNickname}
                            currentUserId={currentUser?.id}
                        />
                    )}
                    <span className="post-date">
                        {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                </div>

                {isOwner && (
                    <div className="post-actions">
                        <button onClick={handleHistoryClick}>내역</button>
                        <button
                            onClick={() =>
                                navigate(`/posts/write/${post.id}/edit`)
                            }
                        >
                            수정
                        </button>
                        <button
                            className="btn-delete"
                            onClick={() =>
                                window.confirm('삭제하시겠습니까?') &&
                                deletePostMutation.mutate()
                            }
                        >
                            삭제
                        </button>
                    </div>
                )}
            </header>

            {/* ===== 본문 ===== */}
            <section className="post-content">
                <Viewer initialValue={post.content}/>
            </section>

            {/* ===== 태그 ===== */}
            <div className="tag-list">
                {post.tags.map((tag) => (
                    <span
                        key={tag}
                        className="tag-item"
                        onClick={() => handleTagClick(tag)}
                    >
                        #{tag}
                    </span>
                ))}
            </div>

            {/* ===== 댓글 ===== */}
            <section className="comment-section">
                <h3 className="comment-count">
                    {comments.length}개의 댓글
                </h3>

                {currentUser && (
                    <div className="comment-input-row">
                        <input
                            type="text"
                            className="comment-input"
                            placeholder="댓글을 작성하세요"
                            value={commentInput}
                            onChange={(e) =>
                                setCommentInput(e.target.value)
                            }
                            onKeyDown={(e) =>
                                e.key === 'Enter' &&
                                !e.nativeEvent.isComposing &&
                                handleCreateComment()
                            }
                        />
                        <button
                            className="btn-submit-comment"
                            disabled={!commentInput.trim()}
                            onClick={handleCreateComment}
                        >
                            등록
                        </button>
                    </div>
                )}

                <div className="comment-list">
                    {comments.map((comment) => {
                        const isMyComment =
                            currentUser?.id === comment.userId;

                        return (
                            <div
                                key={comment.id}
                                className={`comment-item ${
                                    isMyComment ? 'mine' : 'other'
                                }`}
                                ref={(el) =>
                                    el &&
                                    (commentRefs.current[comment.id] = el)
                                }
                            >
                                <div className="comment-header">
                                    <div>
                                        <span className="comment-user">
                                            {comment.nickname}
                                        </span>
                                        <span className="comment-date">
                                            {new Date(
                                                comment.createdAt
                                            ).toLocaleDateString('ko-KR')}
                                        </span>
                                    </div>

                                    {isMyComment && (
                                        <div className="comment-actions">
                                            {editingCommentId === comment.id ? (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            updateCommentMutation.mutate(
                                                                {
                                                                    commentId:
                                                                    comment.id,
                                                                    content:
                                                                    editContent,
                                                                }
                                                            )
                                                        }
                                                    >
                                                        저장
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingCommentId(
                                                                null
                                                            );
                                                            setEditContent('');
                                                        }}
                                                    >
                                                        취소
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setEditingCommentId(
                                                                comment.id
                                                            );
                                                            setEditContent(
                                                                comment.content
                                                            );
                                                        }}
                                                    >
                                                        수정
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteComment(
                                                                comment.id
                                                            )
                                                        }
                                                    >
                                                        삭제
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {editingCommentId === comment.id ? (
                                    <input
                                        className="comment-input edit"
                                        value={editContent}
                                        onChange={(e) =>
                                            setEditContent(e.target.value)
                                        }
                                    />
                                ) : (
                                    <p className="comment-text">
                                        {comment.content}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default PostDetailContent;
