import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api/postsApi";

import CategoryFilter from "../components/category/CategoryFilter";
import PostList from "../components/post/PostList";
import Pagination from "../components/common/Pagination";

export default function MainPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page") ?? 0);
    const category = searchParams.get("category") ?? "전체";

    const { data, isLoading, isError} = useQuery({
        queryKey: ["posts", page, category],
        queryFn: () => fetchPosts({ page, category }),
        keepPreviousData: true,
    });

    return (
        <>
            {/* 카테고리 항상 노출 */}
            <CategoryFilter
                selected={category}
                onSelect={(c) =>
                    setSearchParams({ category: c, page: 0 })
                }
            />

            {/* 목록 상태 판단은 PostList */}
            <PostList
                posts={data?.content}
                isLoading={isLoading}
                isError={isError}
            />

            {/* 페이지네이션은 데이터 있을 때만 */}
            {data && data.totalPages > 1 && (
                <Pagination
                    page={data.currentPage}
                    totalPages={data.totalPages}
                    onChange={(nextPage) =>
                        setSearchParams({ category, page: nextPage })
                    }
                />
            )}
        </>
    );
}