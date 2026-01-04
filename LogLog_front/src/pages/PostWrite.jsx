import React, { useState, useRef } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '../css/PostWrite.css';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { fetchCategories } from '../api/categoryApi';
import { createPosts } from '../api/postsApi'; // JSON 전송 방식 (수정 완료된 버전)
import { uploadImage } from '../api/fileApi';
import { useToast } from '../hooks/useToast';
import defaultThumbnail from "../assets/images/default.png";
const PostWrite = () => {
  const editorRef = useRef();
  const fileInputRef = useRef();
  const queryClient = useQueryClient();

  // --- 상태 관리 ---
  const [title, setTitle] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [thumbnailType, setThumbnailType] = useState('default');
  const [status, setStatus] = useState('PUBLISHED');
  const [categoryId, setCategoryId] = useState(''); // 초기값 '' 설정

  // 이미지 URL 상태 (업로드 후 받아온 주소 저장)
  const [imageUrl, setImageUrl] = useState("");

  const toast = useToast();

  // --- 1. 이미지 업로드 Mutation
  const uploadMutation = useMutation({
    mutationFn: (file) => uploadImage(file),
    onSuccess: (result) => {
      console.log("이미지 업로드 성공:", result);

      // 서버에서 준 URL을 상태에 저장
      const uploadedUrl = result.imageUrl || result;
      setImageUrl(uploadedUrl);
    },
    onError: (error) => {
      console.error("업로드 실패:", error);
      alert('이미지 업로드에 실패했습니다.');
    }
  });

  // --- 2. 게시글 생성 Mutation (JSON 전송) ---
  const createMutation = useMutation({
    mutationFn: createPosts,
    onSuccess: () => {
        toast.success('게시글이 등록되었습니다!');
        queryClient.invalidateQueries({ queryKey: ['log_posts'] });
      // 성공 후 페이지 이동 로직이 있다면 추가 (예: navigate(''))
    },
    onError: (error) => {
      console.error("게시글 등록 실패:", error);
      toast.error('게시글 등록에 실패했습니다. 관리자에게 문의해주세요.');

    }
  });

  // --- 3. 핸들러 함수들 ---

  // 태그 핸들러
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

  // 파일 선택 버튼 클릭
  const handleThumbnailBtnClick = () => {
    fileInputRef.current.click();
  };

  //파일 선택 시
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 1. 이미지 파일인지 확인
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }
      // 2. 선택 즉시 서버로 업로드
      uploadMutation.mutate(file);
    }
  };

  // 저장 핸들러
  const handleDraft = (evt) => {
    evt.preventDefault();
    const content = editorRef.current.getInstance().getMarkdown();

    // 1. 제목 유효성 검사
    if (!title.trim()) {
        toast.info('제목은 필수입니다.');
      return;
    }

    // 2. 업로드 중이면 막기
    if (uploadMutation.isPending) {
        toast.warning('이미지를 업로드 중입니다. 잠시만 기다려주세요.');
      return;
    }

    // 3. Payload 생성
    const payload = {
      title: title.trim(),
      content,
      // URL 문자열 보내기 (없으면 null)
      thumbnailUrl: (thumbnailType !== 'default') ? imageUrl : null,
      categoryId: (categoryId != "") ? Number(categoryId) : null,
      status: status,
      tags
    };

    console.log('최종 전송 데이터(JSON):', payload);

    // 4. 전송
    createMutation.mutate(payload);
    toast.success('저장되었습니다.');
  };


  const handleSave = (evt) => {
      evt.preventDefault();
      const content = editorRef.current.getInstance().getMarkdown();

      // 1. 유효성 검사
      if(!title.trim()) {
          toast.info('제목은 필수입니다.');
          return;
      }else if(!content.trim()) {
          toast.info('내용은 필수입니다.');
          return;
      }else if(categoryId == "") {
          toast.info('카테고리는 필수입니다.');
          return;
      }
      // 2. 업로드 중이면 막기
      if (uploadMutation.isPending) {
          toast.warning('이미지를 업로드 중입니다. 잠시만 기다려주세요.');
          return;
      }
      // 3. Payload 생성
      const payload = {
          title: title.trim(),
          content,
          // URL 문자열 보내기 (없으면 null)
          thumbnailUrl: (thumbnailType !== 'default') ? imageUrl : null,
          categoryId: (categoryId != "") ? Number(categoryId) : null,
          status: status,
          tags
      };
      console.log('최종 전송 데이터(JSON):', payload);

      // 4. 전송
      createMutation.mutate(payload);
      toast.success('저장되었습니다.');
  }

  // 카테고리 불러오기
  const { data: categories = [] } = useQuery({
    queryKey: ['log_category'],
    queryFn: fetchCategories,
  });

  return (
    <div className="editor-container">
      {/* 제목 입력 */}
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

      {/* 하단 설정 */}
      <div className="settings-container">

        {/* 썸네일 설정 */}
        <div className="setting-item">
          <h3>썸네일 설정</h3>
          <div className="thumbnail-options">
            {/* 기본 썸네일 */}
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
                  <img src={defaultThumbnail} alt="" />
              </div>
            </label>

            {/* 직접 썸네일 등록 */}
            <label className={`thumb-card ${thumbnailType === 'custom' ? 'selected' : ''}`}>
              <div className="radio-header">
                <input
                  type="radio"
                  name="thumbnail"
                  checked={thumbnailType === 'custom'}
                  onChange={() => setThumbnailType('custom')}
                /> 직접 썸네일 등록하기
              </div>
                {/* 직접 썸네일 등록 카드 내의 preview 영역 */}
                <div
                    className="thumb-preview upload-preview"
                    onClick={imageUrl ? handleThumbnailBtnClick : undefined}
                    style={{

                        position: 'relative',
                        overflow: 'hidden', // 이미지가 박스를 넘어가면 자름
                        padding: imageUrl ? 0 : undefined, // 이미지가 있으면 내부 여백 제거
                        cursor: imageUrl ? 'pointer' : 'default', // 이미지 위에서는 손가락 커서

                    }}
                >
                    {uploadMutation.isPending ? (
                        <p style={{ color: 'blue', margin: 0 }}>업로드 중... ⏳</p>
                    ) : imageUrl ? (
                        <img
                            src={imageUrl.startsWith('http') ? imageUrl : `${"http://localhost:8088"}${imageUrl}`}
                            // src={imageUrl}
                            alt="Thumbnail Preview"
                            className="thumb-preview-img"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover', // 비율 유지하며 박스 꽉 채우기 (중요!)
                                display: 'block'
                            }}
                        />
                    ) : (
                        // 이미지가 없을 때 (기존 버튼 표시)
                        <>
                            <div className="upload-icon">📷</div>
                            <button
                                type="button"
                                className="btn-upload"
                                onClick={(e) => { e.stopPropagation(); handleThumbnailBtnClick(); }}
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
        <button className="btn-exit">← 나가기</button>
        <div className="footer-actions">
          <button className="btn-draft" onClick={handleDraft} >임시저장</button>
          <button className="btn-save" onClick={handleSave}>저장하기</button>
        </div>
      </div>
    </div>
  );
};

export default PostWrite;