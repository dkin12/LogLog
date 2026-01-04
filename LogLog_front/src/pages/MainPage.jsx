import {useSearchParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchPosts} from "../api/postsApi";
import {fetchCategories} from "../api/categoryApi";

import CategoryFilter from "../components/category/CategoryFilter";
import PostList from "../components/post/PostList";
import Pagination from "../components/common/Pagination";
import "./MainPage.css";

export default function MainPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    // 현재 페이지 (0-based)
    const page = Number(searchParams.get("page") ?? 0);

    // 카테고리 필터
    const categoryIdParam = searchParams.get("categoryId");
    const categoryId = categoryIdParam ? Number(categoryIdParam) : null;

    // 검색 조건
    const keyword = searchParams.get("keyword");
    const tag = searchParams.get("tag");

    // 카테고리 조회
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
                categoryId,
                keyword,
                tag,
            }),
        keepPreviousData: true,
    });

    return (
        <>
            <div className="page-wrapper">
                {/* 카테고리 항상 노출 */}
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

                {/* 총 게시글 수 & 검색 결과 요약 */}
                <div className="content-wrapper">
                    {data && (
                        <div className="post-summary">
                            {keyword ? (
                                <>
                                    <strong>"{keyword}"</strong> 검색 결과 · {data.totalElements}건
                                </>
                            ) : tag ? (
                                <>
                                    <strong>#{tag}</strong> 태그 검색 결과 · {data.totalElements}건
                                </>
                            ) : categoryId && selectedCategoryName ? (
                                <>
                                    <strong>{selectedCategoryName}</strong> 카테고리 · {data.totalElements}건
                                </>
                            ) : (
                                <>
                                    총 {data.totalElements}건
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* 목록 상태 판단은 PostList */}
                <div className="content-wrapper">
                    <PostList
                        posts={data?.content}
                        isLoading={isLoading}
                        isError={isError}
                    />
                </div>

                {/* 페이지네이션 */}
                <div className="pagination-wrapper">
                    {data && data.totalPages > 1 && (
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
                    )}
                </div>
            </div>
        </>
    );
}
