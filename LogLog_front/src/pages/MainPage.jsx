import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api/postsApi";

import CategoryFilter from "../components/category/CategoryFilter";
import PostList from "../components/post/PostList";
import Pagination from "../components/common/Pagination";

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

    // 게시글 조회
    const { data, isLoading, isError } = useQuery({
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
            {/* 카테고리 항상 노출 */}
            <CategoryFilter
                selectedCategoryId={categoryId}
                onSelect={(id) =>
                    setSearchParams({
                        page: 0,
                        ...(id ? { categoryId: id } : {}),
                        ...(keyword ? { keyword } : {}),
                        ...(tag ? { tag } : {}),
                    })
                }
            />

            {/* 목록 상태 판단은 PostList */}
            <PostList
                posts={data?.content}
                isLoading={isLoading}
                isError={isError}
            />

            {/* 페이지네이션 */}
            {data && data.totalPages > 1 && (
                <Pagination
                    page={data.currentPage}
                    totalPages={data.totalPages}
                    onChange={(nextPage) =>
                        setSearchParams({
                            page: nextPage,
                            ...(categoryId ? { categoryId } : {}),
                            ...(keyword ? { keyword } : {}),
                            ...(tag ? { tag } : {}),
                        })
                    }
                />
            )}
        </>
    );
}
