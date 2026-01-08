import {useSearchParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchPosts} from "../api/postsApi";
import {fetchCategories} from "../api/categoryApi";

import PostList from "../components/post/PostList";
import Pagination from "../components/common/Pagination";
import FolderGrid from "../components/common/main/FolderGrid";

import "./HomePage.css";

export default function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams();

    // query params
    const page = Number(searchParams.get("page") ?? 0);
    const categoryIdParam = searchParams.get("categoryId");
    const categoryId = categoryIdParam ? Number(categoryIdParam) : null;

    /* =========================
       카테고리 목록 (항상 조회)
       ========================= */
    const {data: categories = []} = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: Infinity,
        select: (data) => {
            // data가 배열이면 그대로
            if (Array.isArray(data)) return data;
            // data가 PageResponse면 content 사용
            if (Array.isArray(data?.content)) return data.content;
            // 그 외는 빈 배열
            return [];
        },
    });

    /* =========================
       게시글 목록 (카테고리 선택 시만)
       ========================= */
    const {
        data,
        isLoading,
        isError,
    } = useQuery({
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
        <div className="page-wrapper home-page">
            <div className="home-layout">
                {/* 전체 (메인 폴더 화면) */}
                {categoryId === null && (
                    <>
                        <div className="main-hero">
                            <h2>모든 기록의 시작</h2>
                            <p>카테고리별로 정리된 ログログ의 기록들</p>
                        </div>

                        <FolderGrid
                            categories={categories}
                            onSelect={(id) =>
                                setSearchParams({
                                    categoryId: id,
                                    page: 0,
                                })
                            }
                        />
                    </>
                )}

                {/* =========================
                카테고리 선택 후 (게시글 목록)
               ========================= */}
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

                        <div className="home-content">
                            <PostList
                                posts={data?.content}
                                isLoading={isLoading}
                                isError={isError}
                            />
                        </div>

                        {data && data.totalPages > 1 && (
                            <div className="pagination-wrapper">
                                <Pagination
                                    page={data.currentPage}
                                    totalPages={data.totalPages}
                                    onChange={(nextPage) =>
                                        setSearchParams({
                                            categoryId,
                                            page: nextPage,
                                        })
                                    }
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
