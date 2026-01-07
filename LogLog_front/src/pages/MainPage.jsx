import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api/postsApi";
import { fetchCategories } from "../api/categoryApi";

import PostList from "../components/post/PostList";
import Pagination from "../components/common/Pagination";
import "./MainPage.css";

export default function MainPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page") ?? 0);
    const categoryIdParam = searchParams.get("categoryId");
    const categoryId = categoryIdParam ? Number(categoryIdParam) : null;

    // 카테고리 조회
    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: Infinity,
    });

    // 게시글 조회 (카테고리 선택 시만)
    const { data, isLoading, isError } = useQuery({
        queryKey: ["posts", page, categoryId],
        queryFn: () =>
            fetchPosts({
                page,
                categoryId,
            }),
        enabled: categoryId !== null,
        keepPreviousData: true,
    });

    return (
        <div className="page-wrapper">

            {/* ====== 메인 (전체) : 폴더 화면 ====== */}
            {categoryId === null && (
                <>
                    <div className="main-hero">
                        <h2>기록은 이렇게 쌓여요</h2>
                        <p>카테고리별로 모아본 LogLog의 기록들</p>
                    </div>

                    <div className="folder-grid">
                        {categories.map((cat) => (
                            <div
                                key={cat.categoryId}
                                className="folder-card"
                                onClick={() =>
                                    setSearchParams({ categoryId: cat.categoryId, page: 0 })
                                }
                            >
                                <div className="folder-title">
                                    📁 {cat.categoryName}
                                </div>
                                <div className="folder-sub">
                                    기록 보러가기 →
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* ====== 카테고리 선택 시 : 게시글 목록 ====== */}
            {categoryId !== null && (
                <>
                    <div className="category-header">
                        <button
                            className="back-button"
                            onClick={() => setSearchParams({})}
                        >
                            ← 전체로 돌아가기
                        </button>
                    </div>

                    <PostList
                        posts={data?.content}
                        isLoading={isLoading}
                        isError={isError}
                    />

                    <div className="pagination-wrapper">
                        {data && data.totalPages > 1 && (
                            <Pagination
                                page={data.currentPage}
                                totalPages={data.totalPages}
                                onChange={(nextPage) =>
                                    setSearchParams({
                                        page: nextPage,
                                        categoryId,
                                    })
                                }
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
