import React from 'react';
import { Viewer } from '@toast-ui/react-editor';
import '../../css/PostDetailContent.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deletePosts } from "../../api/postsApi.js";
import { useToast } from "../../hooks/useToast.js";
import { useNavigate } from "react-router";

const PostDetailContent = ({ post, currentUser }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const toast = useToast();

    const deleteMutation = useMutation({
        mutationFn: () => deletePosts(post.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['log_posts'] });
            toast.success('게시글이 삭제되었습니다.');
            navigate('/', { replace: true });
        },
        onError: (error) => {
            toast.error(error.message);
            alert('삭제 실패: ' + error.message);
        }
    })


    if (!post || !post.content) return null;

    const content = post.content;
    const isOwner = currentUser && (currentUser.id === post.userId);

    return (
        <div className="post-detail-container">
            <div className="post-header">
                <h1 className="post-title">{post.title}</h1>
                <div className="post-meta">
                    <div className="post-info">
                        <span style={{ fontWeight: 'bold' }}>{post.userNickname}</span>
                        <span style={{ color: '#ccc' }}>|</span>
                        <span>
                            {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                    {
                        isOwner && (
                            <div className="post-actions">
                                <button className="btn-history">내역</button>
                                <button
                                    className="btn-update"
                                    onClick={() => navigate(`/posts/write/${post.id}/edit`)}
                                >수정</button>
                                <button
                                    className="btn-delete"
                                    onClick={() => {
                                        if (window.confirm('삭제하시겠습니까?')) {
                                            deleteMutation.mutate(post.id);
                                        }
                                    }}>삭제</button>
                            </div>
                        )
                    }
                </div>
            </div>

            <div className="post-content">

                <Viewer
                    initialValue={content}
                    key={content}
                />
            </div>

            <div className="tag-list">
                {['#Postmortem', '#devops', '#개발자커리어'].map((tag, index) => (
                    <span key={index} className="tag-item">{tag}</span>
                ))}
            </div>
        </div>
    );
};

export default PostDetailContent;

// const PostDetails = () => {
//     // 댓글 입력 상태 관리
//     const [comment, setComment] = useState('');
//
//     return (
//         <div className="post-detail-container">
//
//             {/* 1. 게시글 헤더 */}
//             <div className="post-header">
//                 <h1 className="post-title">
//                     블레임리스, '착한 사람'이 되기 위함이 아닙니다: 생존을 위한 공학적 선택
//                 </h1>
//                 <div className="post-meta">
//                     <div className="post-info">
//                         <span style={{ fontWeight: 'bold' }}>JK님</span>
//                         <span style={{ color: '#ccc' }}>|</span>
//                         <span>2025년 12월 5일</span>
//                     </div>
//                     <button className="btn-history">수정 내역 보기</button>
//                 </div>
//             </div>
//
//             {/* 2. 게시글 본문 (HTML 구조 흉내) */}
//             <div className="post-content">
//
//             </div>
//
//             {/* 3. 태그 목록 */}
//             <div className="tag-list">
//                 {['#Postmortem', '#devops', '#개발자커리어', '#리더십', '#블레임리스', '#생산성', '#소통', '#조직문화', '#회고', '#회고록'].map((tag, index) => (
//                     <span key={index} className="tag-item">{tag}</span>
//                 ))}
//             </div>
//
//             {/* 4. 댓글 영역 */}
//             <div className="comment-section">
//                 <h3 className="comment-count">0 개의 댓글</h3>
//
//                 {/* 댓글 작성 창 */}
//                 <div className="comment-input-wrapper">
//           <textarea
//               className="comment-textarea"
//               placeholder="댓글을 작성하세요."
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//           ></textarea>
//                     <div className="comment-btn-wrapper">
//                         <button className="btn-submit-comment">댓글 작성</button>
//                     </div>
//                 </div>
//
//                 {/* 댓글 목록 (예시 데이터) */}
//                 <div className="comment-list">
//                     <div className="comment-item">
//                         <div className="comment-header">
//                             <div>
//                                 <span className="comment-user">이지훈</span>
//                                 <span className="comment-date">2025년 12월 12일</span>
//                             </div>
//                             <div className="comment-actions">
//                                 <button>수정</button>
//                                 <button className="delete-btn">삭제</button>
//                             </div>
//                         </div>
//                         <div className="comment-text">
//
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
