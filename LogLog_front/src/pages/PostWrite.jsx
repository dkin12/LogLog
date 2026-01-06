import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '../css/PostWrite.css';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { fetchCategories } from '../api/categoryApi';
import { createPosts, detailPost, fetchPosts, updatePosts } from '../api/postsApi';
import { uploadImage } from '../api/fileApi';
import { useToast } from '../hooks/useToast';
import defaultThumbnail from "../assets/images/default.png";
import { useNavigate, useParams } from "react-router";

const PostWrite = ({ mode }) => {
    const editorRef = useRef();
    const fileInputRef = useRef();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { id } = useParams();
    const postId = Number(id);
    const isEdit = mode === 'edit';

    // --- 상태 관리 ---
    const [title, setTitle] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);

    // 썸네일 타입: 초기값은 'default'지만, 수정 시 이미지가 있으면 'custom'으로 바뀜
    const [thumbnailType, setThumbnailType] = useState('default');

    const [status, setStatus] = useState('PUBLISHED');
    const [categoryId, setCategoryId] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState("");

    const toast = useToast();

    // --- 1. 이미지 업로드 Mutation ---
    const uploadMutation = useMutation({
        mutationFn: (file) => uploadImage(file),
        onSuccess: (result) => {
            console.log("이미지 업로드 성공:", result);
            const uploadedUrl = result.imageUrl || result;
            setThumbnailUrl(uploadedUrl);

            // 업로드 성공 시에도 '직접 등록'으로 자동 선택
            setThumbnailType('custom');
        },
        onError: (error) => {
            console.error("업로드 실패:", error);
            alert('이미지 업로드에 실패했습니다.');
        }
    });

    // --- 2. 게시글 생성/수정 Mutation ---
    const createMutation = useMutation({
        mutationFn: createPosts,
        onSuccess: () => {
            toast.success('게시글이 등록되었습니다!');

            // 1. 먼저 쿼리 캐시를 비웁니다.
            queryClient.invalidateQueries({ queryKey: ['log_posts'] });

            // 2. 페이지 이동 후 강제로 새로고침하는 방법
            window.location.href = '/posts';
        },
        onError: (error) => {
            toast.error('등록 실패: ' + error.message);
        }
    });

    const updateMutation = useMutation({
        mutationFn: (payload) => updatePosts(postId, payload),
        onSuccess: (updatedPost) => {
            toast.success('게시글이 수정되었습니다!');
            queryClient.invalidateQueries({ queryKey: ['log_posts'] });
            queryClient.invalidateQueries({ queryKey: ['log_posts', postId] });
            queryClient.setQueryData(['log_posts', postId], updatedPost);
            navigate(`/posts/${postId}`, { replace: true });
        },
        onError: (error) => {
            toast.error('수정 실패: ' + error.message);
        }
    });

    // --- 태그 핸들러 ---
    const handleTagKeyDown = (e) => {
        if (e.nativeEvent.isComposing) return;
        if (e.key === 'Enter' && tagInput.trim() !== '') {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };
    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    // --- 데이터 조회 ---
    const { data: post } = useQuery({
        queryKey: ['log_posts', postId],
        queryFn: () => detailPost(postId),
        enabled: isEdit && !!postId,
    });

    const { data: categories = [] } = useQuery({
        queryKey: ['log_category'],
        queryFn: fetchCategories,
    });

    useEffect(() => {
        if (!isEdit || !post) return;

        console.log("=== 데이터 로딩 ===");
        console.log("썸네일 주소:", post.thumbnailUrl);

        // 1. 기본 정보 채우기
        setTitle(post.title);
        setTags(post.tags || []);
        setCategoryId(post.categoryId ? String(post.categoryId) : '');
        setStatus(post.status);

        if (editorRef.current) {
            editorRef.current.getInstance().setMarkdown(post.content || '');
        }
        console.log(post);
        console.log(post.thumbnailUrl);
        if (post.thumbnailUrl && post.thumbnailUrl !== "") {
            setThumbnailUrl(post.thumbnailUrl);
            setThumbnailType('custom');
        } else {
            setThumbnailType('default');
        }

    }, [isEdit, post]);


    // 파일 선택 버튼 트리거
    const handleThumbnailBtnClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('이미지 파일만 업로드 가능합니다.');
                return;
            }
            uploadMutation.mutate(file);
        }
    };

    // 공통 저장 로직
    const submitPost = (targetStatus) => {
        const content = editorRef.current.getInstance().getMarkdown();

        if (!title.trim()) {
            toast.info('제목은 필수입니다.');
            return;
        }

        if (targetStatus === 'PUBLISHED') {
            if (!content.trim()) {
                toast.info('내용을 입력해주세요.');
                return;
            } else if (categoryId === "") {
                toast.info('카테고리는 필수입니다.');
                return;
            }
        }

        if (uploadMutation.isPending) {
            toast.warning('이미지 업로드 중입니다.');
            return;
        }

        const payload = {
            title: title.trim(),
            content,
            // ★ custom일 때만 imageUrl을 보냄
            thumbnailUrl: (thumbnailType === 'custom') ? thumbnailUrl : null,
            categoryId: (categoryId !== "") ? Number(categoryId) : null,
            status: targetStatus,
            tags
        };

        if (isEdit) {
            updateMutation.mutate(payload);
        } else {
            createMutation.mutate(payload);
        }
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

                {/* 설정 영역 */}
                <div className="settings-container">
                    {/* 썸네일 설정 */}
                    <div className="setting-item">
                        <h3>썸네일 설정</h3>
                        <div className="thumbnail-options">

                            {/* 1. 기본 썸네일 */}
                            <label className={`thumb-card ${thumbnailType === 'default' ? 'selected' : ''}`}>
                                <div className="radio-header">
                                    <input
                                        type="radio"
                                        name="thumbnail"
                                        checked={thumbnailType === 'default'}
                                        onChange={() => setThumbnailType('default')}
                                    /> 기본 썸네일 설정
                                </div>
                                <div className="thumb-preview default-preview">
                                    <img src={defaultThumbnail} alt="Default" />
                                </div>
                            </label>

                            {/* 2. 직접 등록 */}
                            <label className={`thumb-card ${thumbnailType === 'custom' ? 'selected' : ''}`}>
                                <div className="radio-header">
                                    <input
                                        type="radio"
                                        name="thumbnail"
                                        checked={thumbnailType === 'custom'}
                                        onChange={() => setThumbnailType('custom')}
                                    /> 직접 썸네일 등록하기
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
                            </label>

                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    {/* 공개 설정 */}
                    <div className="setting-item">
                        <h3>공개 설정</h3>
                        <div className="visibility-buttons">
                            <button
                                className={`vis-btn ${status === 'PUBLISHED' ? 'active' : ''}`}
                                onClick={() => setStatus('PUBLISHED')}
                            >
                                🌏 전체 공개
                            </button>
                            <button
                                className={`vis-btn ${status === 'PRIVATE' ? 'active' : ''}`}
                                onClick={() => setStatus('PRIVATE')}
                            >
                                🔒 비공개
                            </button>
                        </div>
                    </div>

                    {/* 카테고리 */}
                    <div className="setting-item">
                        <h3>카테고리</h3>
                        <select
                            className="category-select"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">== 카테고리 선택 ==</option>
                            {categories.map((item) => (
                                <option key={item.categoryId} value={item.categoryId}>
                                    {item.categoryName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 태그 */}
                    <div className="setting-item">
                        <h3>태그</h3>
                        <input
                            type="text"
                            className="tag-input"
                            placeholder="태그를 입력하세요"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                        />
                        <div className="tags-list">
                            {tags.map((tag, index) => (
                                <span key={index} className="tag-chip" onClick={() => removeTag(tag)}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="editor-footer">
                    <button className="btn-exit" onClick={() => navigate(-1)}>← 나가기</button>
                    <div className="footer-actions">
                        {!isEdit && (
                            <button className="btn-draft" onClick={() => submitPost('DRAFT')}>임시저장</button>
                        )}
                        <button className="btn-save" onClick={() => submitPost(status)}>저장하기</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostWrite;