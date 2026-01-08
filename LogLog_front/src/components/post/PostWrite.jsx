import React, {useState, useRef, useEffect, useMemo} from 'react';
import {Editor} from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import './PostWrite.css';
import {useLocation, useNavigate, useParams} from "react-router";
import {Box} from '@mui/material'; // MUI Box 추가

// API & Hooks
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import {fetchCategories} from '../../api/categoryApi.js';
import {createPosts, detailPost, updatePosts, getPostDetailHistories} from '../../api/postsApi.js';
import {uploadImage} from '../../api/fileApi.js';
import {useToast} from '../../hooks/useToast.js';
import defaultThumbnail from "../../assets/images/default.png";

const usePostLogics = (mode, id) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const toast = useToast();
    const location = useLocation();

    // 복원할 히스토리 ID (있다면)
    const restoreHistoryId = location.state?.restoreHistoryId;

    // --- 데이터 조회 ---
    // 카테고리
    const {data: categories = []} = useQuery({
        queryKey: ['log_category'],
        queryFn: fetchCategories,
    });

    // 게시글 상세 (수정 모드일 때)
    const {data: postData} = useQuery({
        queryKey: ['log_posts', Number(id)],
        queryFn: () => detailPost(id),
        enabled: !!id && !isNaN(Number(id)),
    });

    // 히스토리 상세 (복원 모드일 때)
    const {data: historyData} = useQuery({
        queryKey: ['post_history_detail', restoreHistoryId],
        queryFn: () => getPostDetailHistories(restoreHistoryId),
        enabled: !!restoreHistoryId,
    });

    // 최종적으로 사용할 초기 데이터 결정
    const initialData = useMemo(() => {
        return historyData || postData || null;
    }, [historyData, postData]);

    // --- Mutations ---
    const createMutation = useMutation({
        mutationFn: createPosts,
        onSuccess: (res, variables) => {
            const newId = res.id || res;
            if (variables.draftYn === "Y") {
                toast.success("임시저장 되었습니다.");
                navigate(`/posts/write/${newId}/draft`, {replace: true});
            } else {
                toast.success('게시글이 등록되었습니다!');
                navigate(`/posts/${newId}`);
            }
            queryClient.invalidateQueries({queryKey: ['log_posts']});
        }
    });

    const updateMutation = useMutation({
        mutationFn: (payload) => updatePosts(id, payload),
        onSuccess: (updatedPost, variables) => {
            queryClient.setQueryData(['log_posts', Number(id)], updatedPost);

            if (variables.draftYn === "Y") {
                toast.success("임시저장 되었습니다.");
                navigate(`/posts/write/${id}/draft`, {replace: true});
            } else {
                toast.success("수정 완료!");
                navigate(`/posts/${id}`, {replace: true});
            }
            queryClient.invalidateQueries({queryKey: ['log_posts']});
        },
        onError: (err) => toast.error('수정 실패: ' + err.message)
    });

    const uploadMutation = useMutation({
        mutationFn: uploadImage,
        onError: () => toast.error('이미지 업로드 실패')
    });

    return {
        initialData,
        categories,
        createMutation,
        updateMutation,
        uploadMutation,
        restoreHistoryId
    };
};

// =================================================================
// 썸네일 설정
// =================================================================
const ThumbnailSection = ({thumbnailType, setThumbnailType, thumbnailUrl, setThumbnailUrl, uploadMutation}) => {
    const fileInputRef = useRef();
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadMutation.mutate(file, {
                onSuccess: (res) => {
                    setThumbnailUrl(res.imageUrl || res);
                    setThumbnailType('custom');
                }
            });
        }
    };

    const getImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${apiBase}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    return (
        <div className="setting-item">
            <h3>썸네일 설정</h3>
            <div className="thumbnail-options">
                {/* 1. 기본 이미지 */}
                <label className={`thumb-card ${thumbnailType === 'default' ? 'selected' : ''}`}>
                    <div className="radio-header">
                        <input
                            type="radio"
                            checked={thumbnailType === 'default'}
                            onChange={() => {
                                setThumbnailType('default');
                                setThumbnailUrl("");
                            }}
                        /> 기본 이미지
                    </div>
                    <div className="thumb-preview default-preview">
                        <img src={defaultThumbnail} alt="Default"/>
                    </div>
                </label>

                {/* 2. 커스텀 이미지 (MUI Box 적용) */}
                <label className={`thumb-card ${thumbnailType === 'custom' ? 'selected' : ''}`}>
                    <div className="radio-header">
                        <input
                            type="radio"
                            checked={thumbnailType === 'custom'}
                            onChange={() => setThumbnailType('custom')}
                        /> 직접 등록
                    </div>

                    <div
                        className="thumb-preview upload-preview"
                        onClick={() => thumbnailUrl && fileInputRef.current.click()}
                        style={{position: 'relative', padding: thumbnailUrl ? 0 : undefined}}
                    >
                        {uploadMutation.isPending ? (
                            <p style={{color: 'blue', margin: 0}}>업로드 중...</p>
                        ) : thumbnailUrl ? (
                            // ★ 요청하신 MUI Code 적용
                            <Box
                                component="img"
                                src={getImageUrl(thumbnailUrl)}
                                alt="Thumbnail Preview"
                                sx={{
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
                                        fileInputRef.current.click();
                                    }}
                                >
                                    썸네일 등록하기
                                </button>
                            </>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{display: 'none'}}
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </label>
            </div>
        </div>
    );
};

// =================================================================
// 글 작성
// =================================================================
const PostWrite = ({mode}) => {
    const {id} = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const editorRef = useRef();

    // Custom Hook 호출
    const {
        initialData, categories, createMutation, updateMutation, uploadMutation
    } = usePostLogics(mode, id);

    // --- State 관리 ---
    const [title, setTitle] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const [status, setStatus] = useState('PUBLISHED');
    const [categoryId, setCategoryId] = useState('');
    const [thumbnailType, setThumbnailType] = useState('default');
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [draftYn, setDraftYn] = useState(mode === 'draft' ? "Y" : "N");

    // --- 데이터 초기화 (수정/복원 시) ---
    useEffect(() => {
        if (!initialData) return;

        setTitle(initialData.title || "");
        setTags(initialData.tags || []);
        setStatus(initialData.status || "PUBLISHED");
        setDraftYn(initialData.draftYn || "N");
        setCategoryId(initialData.categoryId ? String(initialData.categoryId) : "");

        if (initialData.thumbnailUrl) {
            setThumbnailUrl(initialData.thumbnailUrl);
            setThumbnailType('custom');
        } else {
            setThumbnailType('default');
            setThumbnailUrl("");
        }

        // 에디터 내용 설정
        if (editorRef.current) {
            const instance = editorRef.current.getInstance();
            if (instance.getMarkdown() !== (initialData.content || "")) {
                instance.setMarkdown(initialData.content || "");
            }
        }
    }, [initialData]);

    // --- 핸들러 ---
    const handleTagKeyDown = (e) => {
        if (e.nativeEvent.isComposing) return;
        if (e.key === 'Enter' && tagInput.trim() !== '') {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const submitPost = (isDraft) => {
        const content = editorRef.current.getInstance().getMarkdown();

        if (!title.trim()) return toast.info('제목을 입력해주세요.');
        if (!isDraft) {
            if (!content.trim()) return toast.info('내용을 입력해주세요.');
            if (!categoryId) return toast.info('카테고리를 선택해주세요.');
        }

        const payload = {
            title: title.trim(),
            content,
            thumbnailUrl: (thumbnailType === 'custom') ? thumbnailUrl : null,
            categoryId: categoryId ? Number(categoryId) : null,
            draftYn: isDraft ? 'Y' : 'N',
            status,
            tags
        };

        if (id && !isNaN(Number(id))) {
            updateMutation.mutate(payload);
        } else {
            createMutation.mutate(payload);
        }
    };

    return (
        <div className="layout-content page-scroll">
            <div className="editor-container">
                {/* 1. 제목 입력 */}
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

                {/* 2. 에디터 */}
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

                {/* 3. 설정 영역 */}
                <div className="settings-container">
                    {/* 썸네일 컴포넌트 분리됨 */}
                    <ThumbnailSection
                        thumbnailType={thumbnailType}
                        setThumbnailType={setThumbnailType}
                        thumbnailUrl={thumbnailUrl}
                        setThumbnailUrl={setThumbnailUrl}
                        uploadMutation={uploadMutation}
                    />

                    {/* 공개 설정 */}
                    <div className="setting-item">
                        <h3>공개 설정</h3>
                        <div className="visibility-buttons">
                            {['PUBLISHED', 'PRIVATE'].map((type) => (
                                <button
                                    key={type}
                                    className={`vis-btn ${status === type ? 'active' : ''}`}
                                    onClick={() => setStatus(type)}
                                >
                                    {type === 'PUBLISHED' ? '🌏 전체 공개' : '🔒 비공개'}
                                </button>
                            ))}
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
                                <option key={item.categoryId} value={String(item.categoryId)}>
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
                            placeholder="태그 입력 후 Enter"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                        />
                        <div className="tags-list">
                            {tags.map((tag, index) => (
                                <span key={index} className="tag-chip"
                                      onClick={() => setTags(tags.filter(t => t !== tag))}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. 하단 버튼 */}
                <div className="editor-footer">
                    <button className="btn-exit" onClick={() => navigate(-1)}>← 나가기</button>
                    <div className="footer-actions">
                        {(draftYn === "Y" || mode === "create" || mode === "draft") && (
                            <button className="btn-draft" onClick={() => submitPost(true)}>
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