import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import "./SearchBar.css";

export default function SearchBar() {
    const [keyword, setKeyword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: 검색 페이지 이동 or 검색 API 호출
        console.log("검색어:", keyword);
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="# 태그 또는 검색어를 입력해주세요."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit">
                <IoIosSearch />
            </button>
        </form>
    );
}
