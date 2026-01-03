import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../../api/categoryApi";
import "./CategoryFilter.css";

export default function CategoryFilter({ selectedCategoryId, onSelect }) {
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
                className={!selectedCategoryId ? "active" : ""}
                onClick={() => onSelect(null)}
            >
                전체
            </button>

            {/* DB 카테고리 */}
            {categories.map((cat) => (
                <button
                    key={cat.categoryId}
                    className={selectedCategoryId === cat.categoryId ? "active" : ""}
                    onClick={() => onSelect(cat.categoryId)}
                >
                    {cat.categoryName}
                </button>
            ))}
        </div>
    );
}