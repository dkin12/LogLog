import {useQuery} from "@tanstack/react-query";
import {fetchCategories} from "../../api/categoryApi";
import "../../App.css";
import "./CategoryFilter.css";

export default function CategoryFilter({selectedCategoryId, onSelect}) {
    const {data: categories = []} = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: Infinity,
    });

    return (
        <div className="category-tabs">
            <button
                className={`cat-tab ${!selectedCategoryId ? "active" : ""}`}
                onClick={() => onSelect(null)}
            >
                전체
            </button>

            {categories.map((cat, idx) => (
                <button
                    key={cat.categoryId}
                    className={`cat-tab ${selectedCategoryId === cat.categoryId ? "active" : ""}`}
                    style={{"--tab-color": `var(--folder-${(idx % 8) + 1})`}}
                    onClick={() => onSelect(cat.categoryId)}
                >
                    {cat.categoryName}
                </button>
            ))}
        </div>
    );
}
