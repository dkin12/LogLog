import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import "./SearchBar.css";

export default function SearchBar() {
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

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
            pathname: "/",
            search: new URLSearchParams(params).toString(),
        });

        setKeyword("");
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
