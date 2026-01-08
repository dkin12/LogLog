import "./MainPage.css"
import {useSearchParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchPosts} from "../api/postsApi";
import {fetchCategories} from "../api/categoryApi";

import CategoryFilter from "../components/category/CategoryFilter";
import PostList from "../components/post/PostList";
import Pagination from "../components/common/Pagination";

export default function MainPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    // query params
    const page = Number(searchParams.get("page") ?? 0);
    const categoryIdParam = searchParams.get("categoryId");
    const categoryId = categoryIdParam ? Number(categoryIdParam) : null;
    const keyword = searchParams.get("keyword");
    const tag = searchParams.get("tag");

    // 카테고리 목록 (항상 조회)
    const {data: categories = []} = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: Infinity,
    });

    const selectedCategoryName = categories.find(
        (cat) => cat.categoryId === categoryId
    )?.categoryName;

    // 게시글 조회
    const {data, isLoading, isError} = useQuery({
        queryKey: ["posts", page, categoryId, keyword, tag],
        queryFn: () =>
            fetchPosts({
                page,
                size: 4,   // 메인페이지만 4개
                categoryId,
                keyword,
                tag,
            }),
        keepPreviousData: true,
    });

    return (
        <div className="page-wrapper main-page">
            {/* ===== 카테고리 필터 (고정 영역) ===== */}
            <CategoryFilter
                selectedCategoryId={categoryId}
                onSelect={(id) =>
                    setSearchParams({
                        page: 0,
                        ...(id ? {categoryId: id} : {}),
                        ...(keyword ? {keyword} : {}),
                        ...(tag ? {tag} : {}),
                    })
                }
            />

            {/* ===== 검색 요약 (고정 영역) ===== */}
            <div className="layout-header">
                {data && (
                    <div className="post-summary">
                        {keyword ? (
                            <>
                                <strong>"{keyword}"</strong> 검색 결과 ·{" "}
                                {data.totalElements}건
                            </>
                        ) : tag ? (
                            <>
                                <strong>#{tag}</strong> 태그 검색 결과 ·{" "}
                                {data.totalElements}건
                            </>
                        ) : categoryId && selectedCategoryName ? (
                            <>
                                <strong>{selectedCategoryName}</strong> 카테고리 ·{" "}
                                {data.totalElements}건
                            </>
                        ) : (
                            <>총 {data.totalElements}건</>
                        )}
                    </div>
                )}
            </div>

            {/* ===== 콘텐츠 영역 ===== */}
            <div className="content-area main-content-area main-single-row">
                <PostList
                    posts={data?.content}
                    isLoading={isLoading}
                    isError={isError}
                />
            </div>

            {/* 여백 조절 담당 */}
            <div className="main-spacer"/>

            {/* ===== 페이지네이션 (항상 하단) ===== */}
            {data && data.totalPages > 1 && (
                <div className="pagination-wrapper">
                    <Pagination
                        page={data.currentPage}
                        totalPages={data.totalPages}
                        onChange={(nextPage) =>
                            setSearchParams({
                                page: nextPage,
                                ...(categoryId ? {categoryId} : {}),
                                ...(keyword ? {keyword} : {}),
                                ...(tag ? {tag} : {}),
                            })
                        }
                    />
                </div>
            )}
        </div>
    );
}
