import {useEffect, useState} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import "./SearchBar.css";

export default function SearchBar() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const keywordParam = searchParams.get("keyword");
    const tagParam = searchParams.get("tag");

    // input에 보여줄 값 결정
    const keywordFromUrl = keywordParam
        ? keywordParam
        : tagParam
            ? `#${tagParam}`
            : "";

    // URL 기준으로 검색 키워드 동기화
    const [keyword, setKeyword] = useState(keywordFromUrl);
    useEffect(() => {
        setKeyword(keywordFromUrl);
    }, [keywordFromUrl]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmed = keyword.trim();
        if (!trimmed) return;

        const params = { page: 0 };

        // 기존 카테고리 유지
        const categoryId = searchParams.get("categoryId");
        if (categoryId) params.categoryId = categoryId;

        // "#태그" → "tag:태그"
        if (trimmed.startsWith("#")) {
            params.tag = trimmed.substring(1);   // tag=API테스트
        } else {
            params.keyword = trimmed;
        }

        navigate({
            pathname: "/posts",
            search: new URLSearchParams(params).toString(),
        });
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="#태그 또는 검색어를 입력하세요"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit">
                <IoIosSearch />
            </button>
        </form>
    );
}
