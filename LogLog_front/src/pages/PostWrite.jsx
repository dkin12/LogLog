import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '../css/PostWrite.css';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { fetchCategories } from '../api/categoryApi';
import { createPosts, detailPost, updatePosts, getPostDetailHistories } from '../api/postsApi';
import { uploadImage } from '../api/fileApi';
import { useToast } from '../hooks/useToast';
import defaultThumbnail from "../assets/images/default.png";
import { useLocation, useNavigate, useParams } from "react-router";

const PostWrite = ({ mode }) => {
    const editorRef = useRef();
    const fileInputRef = useRef();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const postId = Number(id);
    const isEdit = mode === 'edit';

    const restoreHistoryId = location.state?.restoreHistoryId;

    // --- 상태 관리 ---
    const [title, setTitle] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const [thumbnailType, setThumbnailType] = useState('default');
    const [status, setStatus] = useState('PUBLISHED');
    const [categoryId, setCategoryId] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState("");

    const toast = useToast();

    // --- 1. 데이터 조회 ---
    const { data: categories = [] } = useQuery({
        queryKey: ['log_category'],
        queryFn: fetchCategories,
    });

    const { data: post } = useQuery({
        queryKey: ['log_posts', postId],
        queryFn: () => detailPost(postId),
    });

    const { data: historyPost } = useQuery({
        queryKey: ['post_history_detail', restoreHistoryId],
        queryFn: () => getPostDetailHistories(restoreHistoryId),
    });

    // --- 2. 데이터 세팅 로직 (useEffect) ---
    useEffect(() => {
        if (mode === 'write' && !restoreHistoryId) return;

        const targetData = historyPost || post;
        if (!targetData) return;

        console.log(restoreHistoryId ? "=== 복구 데이터 적용 ===" : "=== 수정 데이터 적용 ===");

        // [A] 공통 텍스트 필드 세팅
        setTitle(targetData.title || "");
        setTags(post.tags);
        console.log(post)
        setStatus(targetData.status || "PUBLISHED");

        if (editorRef.current) {
            const instance = editorRef.current.getInstance();
            if (instance.getMarkdown() !== (targetData.content || "")) {
                instance.setMarkdown(targetData.content || "");
            }
        }

        const catId = targetData.categoryId ? String(targetData.categoryId) : "";
        setCategoryId(catId);
        console.log(targetData.categoryId);

        if (targetData.thumbnailUrl) {
            setThumbnailUrl(targetData.thumbnailUrl);
            setThumbnailType('custom');
        } else {
            setThumbnailType('default');
            setThumbnailUrl("");
        }

        // categories를 의존성에 넣어 카테고리가 늦게 로드되어도 다시 매칭하게 함
    }, [mode, post, historyPost, restoreHistoryId, categories]);

    const uploadMutation = useMutation({
        mutationFn: (file) => uploadImage(file),
        onSuccess: (result) => {
            const uploadedUrl = result.imageUrl || result;
            setThumbnailUrl(uploadedUrl);
            setThumbnailType('custom');
        },
        onError: () => toast.error('이미지 업로드 실패')
    });

    const updateMutation = useMutation({
        mutationFn: (payload) => updatePosts(postId, payload),
        onSuccess: () => {
            toast.success(restoreHistoryId ? '복구 완료!' : '수정 완료!');
            queryClient.invalidateQueries({ queryKey: ['log_posts'] });
            navigate(`/posts/${postId}`, { replace: true });
        },
        onError: (err) => toast.error('실패: ' + err.message)
    });

    const createMutation = useMutation({
        mutationFn: createPosts,
        onSuccess: () => {
            toast.success('등록 완료!');
            queryClient.invalidateQueries({ queryKey: ['log_posts'] });
            window.location.href = '/posts';
        }
    });

    const handleTagKeyDown = (e) => {
        if (e.nativeEvent.isComposing) return;
        if (e.key === 'Enter' && tagInput.trim() !== '') {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    // 파일 선택 버튼 트리거
    const handleThumbnailBtnClick = () => {
        fileInputRef.current.click();
    };

    const submitPost = (targetStatus) => {
        const content = editorRef.current.getInstance().getMarkdown();
        if (!title.trim()) return toast.info('제목을 입력해주세요.');
        if (targetStatus === 'PUBLISHED' && (!content.trim() || !categoryId)) {
            return toast.info('내용과 카테고리를 확인해주세요.');
        }

        const payload = {
            title: title.trim(),
            content,
            thumbnailUrl: (thumbnailType === 'custom') ? thumbnailUrl : null,
            categoryId: categoryId ? Number(categoryId) : null,
            status: targetStatus,
            tags
        };

        if (isEdit) updateMutation.mutate(payload);
        else createMutation.mutate(payload);
    };

    return (
        <div className="layout-content">
            <div className="editor-container">
                {/* 제목 */}
                <div className="title-section">
                    <input
                        type="text"
                        className="title-input"
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className="title-underline"></div>
                </div>

                {/* 에디터 */}
                <div className="editor-wrapper">
                    <Editor
                        ref={editorRef}
                        placeholder="내용을 입력해주세요."
                        previewStyle="vertical"
                        height="500px"
                        initialEditType="markdown"
                        useCommandShortcut={true}
                    />
                </div>

                <div className="settings-container">
                    {/* 썸네일 */}
                    <div className="setting-item">
                        <h3>썸네일 설정</h3>
                        <div className="thumbnail-options">
                            <label className={`thumb-card ${thumbnailType === 'default' ? 'selected' : ''}`}>
                                <div className="radio-header">
                                    <input type="radio" checked={thumbnailType === 'default'} onChange={() => setThumbnailType('default')} /> 기본 이미지
                                </div>
                                <div className="thumb-preview default-preview">
                                    <img src={defaultThumbnail} alt="Default" />
                                </div>
                            </label>

                            <label className={`thumb-card ${thumbnailType === 'custom' ? 'selected' : ''}`}>
                                <div className="radio-header">
                                    <input type="radio" checked={thumbnailType === 'custom'} onChange={() => setThumbnailType('custom')} /> 직접 등록
                                </div>
                                <div
                                    className="thumb-preview upload-preview"
                                    onClick={thumbnailUrl ? handleThumbnailBtnClick : undefined}
                                    style={{
                                        position: 'relative',
                                        overflow: 'hidden',
                                        padding: thumbnailUrl ? 0 : undefined,
                                        cursor: thumbnailUrl ? 'pointer' : 'default',
                                    }}
                                >
                                    {uploadMutation.isPending ? (
                                        <p style={{ color: 'blue', margin: 0 }}>업로드 중... ⏳</p>
                                    ) : thumbnailUrl ? (
                                        <img
                                            src={
                                                thumbnailUrl.startsWith('http')
                                                    ? thumbnailUrl
                                                    : `http://localhost:8088${thumbnailUrl.startsWith('/') ? '' : '/'}${thumbnailUrl}`
                                            }
                                            alt="Thumbnail Preview"
                                            className="thumb-preview-img"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                display: 'block'
                                            }}
                                        />
                                    ) : (
                                        <>
                                            <div className="upload-icon">📷</div>
                                            <button
                                                type="button"
                                                className="btn-upload"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleThumbnailBtnClick();
                                                }}
                                            >
                                                썸네일 등록하기
                                            </button>
                                        </>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => e.target.files[0] && uploadMutation.mutate(e.target.files[0])} />
                            </label>
                        </div>
                    </div>

                    <div className="setting-item">
                        <h3>카테고리</h3>
                        <select
                            className="category-select"
                            value={String(categoryId || "")}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">== 카테고리 선택 ==</option>
                            {categories && categories.length > 0 ? (
                                categories.map((item) => (
                                    <option key={item.categoryId} value={String(item.categoryId)}>
                                        {item.categoryName}
                                    </option>
                                ))
                            ) : (
                                <option disabled>로딩 중...</option>
                            )}
                        </select>
                    </div>

                    {/* 태그 */}
                    <div className="setting-item">
                        <h3>태그</h3>
                        <input type="text" className="tag-input" placeholder="태그 입력 후 Enter" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} />
                        <div className="tags-list">
                            {tags.map((tag, index) => (
                                <span key={index} className="tag-chip" onClick={() => setTags(tags.filter(t => t !== tag))}>#{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="editor-footer">
                    <button className="btn-exit" onClick={() => navigate(-1)}>← 나가기</button>
                    <div className="footer-actions">
                        {(mode === 'write' || status === 'DRAFT') && (
                            <button className="btn-draft" onClick={() => submitPost('DRAFT')}>임시저장</button>
                        )}
                        <button className="btn-save" onClick={() => submitPost('PUBLISHED')}>
                            {restoreHistoryId ? '복구본으로 저장' : '저장하기'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostWrite;