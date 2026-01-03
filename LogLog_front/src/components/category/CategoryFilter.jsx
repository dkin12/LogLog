import { useQuery } from "@tanstack/react-query";
import "./CategoryFilter.css";
import { fetchCategories } from "../../api/categoryApi.js";

export default function CategoryFilter({ selected, onSelect }) {
    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: Infinity,
    });

    if (isLoading) return null;

    return (
        <div className="category-filter">
            {/* 전체 */}
            <button
                key="all"
                className={selected === "전체" ? "active" : ""}
                onClick={() => onSelect("전체")}
            >
                전체
            </button>

            {/* DB 카테고리 */}
            {categories.map((cat) => (
                <button
                    key={cat.categoryId}
                    className={selected === cat.categoryName ? "active" : ""}
                    onClick={() => onSelect(cat.categoryName)}
                >
                    {cat.categoryName}
                </button>
            ))}
        </div>
    );
}