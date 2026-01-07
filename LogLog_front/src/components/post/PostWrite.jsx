import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '../../css/PostWrite.css';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { fetchCategories } from '../../api/categoryApi.js';
import { createPosts, detailPost, updatePosts, getPostDetailHistories } from '../../api/postsApi.js';
import { uploadImage } from '../../api/fileApi.js';
import { useToast } from '../../hooks/useToast.js';
import defaultThumbnail from "../../assets/images/default.png";
import { useLocation, useNavigate, useParams } from "react-router";

const PostWrite = ({ mode }) => {

    const editorRef = useRef();
    const fileInputRef = useRef();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';

    // --- 상태 관리 ---
    const [currentPostId, setCurrentPostId] = useState(id ? Number(id) : null);
    // mode가 'draft'여도 status는 PUBLISHED(기본값)로 시작 (공개/비공개 설정과 임시저장 분리)
    const [title, setTitle] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const [thumbnailType, setThumbnailType] = useState('default');

    // status: 공개(PUBLISHED) / 비공개(PRIVATE) 선택용
    const [status, setStatus] = useState('PUBLISHED');

    const [categoryId, setCategoryId] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState("");

    // draftYn: 실제 DB에 저장될 임시저장 여부 (초기값 설정)
    const [draftYn, setDraftYn] = useState(mode === 'draft' ? "Y" : "N");

    // 기타 훅
    const toast = useToast();
    const restoreHistoryId = location.state?.restoreHistoryId;

    // --- 1. 데이터 조회 ---
    const { data: categories = [] } = useQuery({
        queryKey: ['log_category'],
        queryFn: fetchCategories,
    });

    const { data: post } = useQuery({
        queryKey: ['log_posts', currentPostId],
        queryFn: () => detailPost(id),
        enabled: !!currentPostId && !isNaN(currentPostId),
    });

    const { data: draftPost, isSuccess } = useQuery({
        queryKey: ['log_posts', currentPostId],
        queryFn: () => detailPost(currentPostId),
        enabled: !!currentPostId && !isNaN(currentPostId),
    });

    const { data: historyPost } = useQuery({
        queryKey: ['post_history_detail', restoreHistoryId],
        queryFn: () => getPostDetailHistories(restoreHistoryId),
        enabled: !!restoreHistoryId,
    });

    // --- 2. 데이터 세팅 (수정/임시저장 불러오기 시) ---
    useEffect(() => {
        const targetData = historyPost || post;
        if (!targetData) return;

        setTitle(targetData.title || "");
        setTags(targetData.tags || []);

        // 서버에서 가져온 공개 상태(PUBLISHED/PRIVATE) 반영
        setStatus(targetData.status);
        // 임시저장 여부 반영
        setDraftYn(targetData.draftYn || "N");

        if (editorRef.current) {
            const instance = editorRef.current.getInstance();
            if (instance.getMarkdown() !== (targetData.content || "")) {
                instance.setMarkdown(targetData.content || "");
            }
        }

        const catId = targetData.categoryId ? String(targetData.categoryId) : "";
        setCategoryId(catId);

        if (targetData.thumbnailUrl) {
            setThumbnailUrl(targetData.thumbnailUrl);
            setThumbnailType('custom');
        } else {
            setThumbnailType('default');
            setThumbnailUrl("");
        }

    }, [currentPostId,post,draftPost, historyPost, restoreHistoryId]);

    // --- MUTATION (생성/수정) ---
    const createMutation = useMutation({
        mutationFn: createPosts,
        onSuccess: (response, variables) => {
            const newId = response.id || response;

            // 요청 시 보낸 draftYN 값에 따라 분기 처리
            if (variables.draftYn === "Y") {
                toast.success("임시저장 되었습니다.");
                setCurrentPostId(newId);
                setStatus(response.status);
                setTitle(response.data.title);
                // URL만 변경하고 페이지 유지 (계속 작성 가능하도록)
                navigate(`/posts/write/${newId}/draft`, { replace: true });
            } else {
                toast.success('게시글이 등록되었습니다!');
                navigate(`/posts/${newId}`);
            }
            queryClient.invalidateQueries({ queryKey: ['log_posts'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: (payload) => updatePosts(currentPostId, payload),
        onSuccess: async (updatedPost, variables) => {
            queryClient.setQueryData(['log_posts', currentPostId], updatedPost);

            if (variables.draftYn === "Y") {
                toast.success("임시저장 내용이 업데이트되었습니다.");
                setDraftYn(variables.draftYn);
                setStatus(variables.status);
                navigate(`/posts/write/${currentPostId}/draft`, { replace: true });
            } else {
                toast.success("수정 완료!");
                navigate(`/posts/${currentPostId}`, { replace: true });
            }

            queryClient.invalidateQueries({ queryKey: ['log_posts'] });
        },
        onError: (err) => toast.error('수정 실패: ' + err.message)
    });

    const uploadMutation = useMutation({
        mutationFn: (file) => uploadImage(file),
        onSuccess: (result) => {
            const uploadedUrl = result.imageUrl || result;
            setThumbnailUrl(uploadedUrl);
            setThumbnailType('custom');
        },
        onError: () => toast.error('이미지 업로드 실패')
    });


    // --- 이벤트 핸들러 ---
    const handleTagKeyDown = (e) => {
        if (e.nativeEvent.isComposing) return;
        if (e.key === 'Enter' && tagInput.trim() !== '') {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleThumbnailBtnClick = () => {
        fileInputRef.current.click();
    };

    // [핵심 수정] 저장 로직
    // isDraft: true면 임시저장(Y), false면 최종저장(N)
    const submitPost = (isDraft) => {
        const content = editorRef.current.getInstance().getMarkdown();

        // 제목은 필수
        if (!title.trim()) return toast.info('제목을 입력해주세요.');

        // '저장하기(발행)' 일 때만 필수값 체크 강화
        if (!isDraft) {
            if (!content.trim()) return toast.info('내용을 입력해주세요.');
            if (!categoryId) return toast.info('카테고리를 선택해주세요.');
        }

        const payload = {
            title: title.trim(),
            content,
            thumbnailUrl: (thumbnailType === 'custom') ? thumbnailUrl : null,
            categoryId: categoryId ? Number(categoryId) : null,
            // 핵심: 버튼에 따라 draftYN 결정
            draftYn: isDraft ? 'Y' : 'N',
            // 핵심: status는 사용자가 선택한 UI 상태(PUBLISHED / PRIVATE) 그대로 전송
            status: status,
            tags
        };

        console.log("Submit Payload:", payload);

        if (currentPostId && !isNaN(currentPostId)) {
            updateMutation.mutate(payload);
        } else {
            createMutation.mutate(payload);
        }
    };

    return (
        <div className="layout-content page-scroll">
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
                                                    : `${apiBase}${thumbnailUrl.startsWith('/') ? '' : '/'}${thumbnailUrl}`
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

                        {/* 임시저장 버튼*/}
                        {(draftYn === "Y" || mode === "create" || mode === "draft") && (
                            <button
                                type="button"
                                className="btn-draft"
                                onClick={() => submitPost(true)}
                            >
                                임시저장
                            </button>
                        )}
                        <button className="btn-save" onClick={() => submitPost(false)}>
                            저장하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostWrite;