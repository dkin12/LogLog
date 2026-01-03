package com.example.loglog.repository;

import com.example.loglog.dto.type.PostStatus;
import com.example.loglog.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends JpaRepository<Post, Long> {

    /* ==================================================
     * 1. 전체 조회 (PUBLISHED만)
     * ================================================== */
    @Query("""
        select p from Post p
        where p.status = :status
    """)
    Page<Post> findAllByStatus(
            @Param("status") PostStatus status,
            Pageable pageable
    );

    /* ==================================================
     * 2. 카테고리 필터
     * ================================================== */
    @Query("""
        select p from Post p
        where p.category.categoryId = :categoryId
          and p.status = :status
    """)
    Page<Post> findByCategory(
            @Param("categoryId") Long categoryId,
            @Param("status") PostStatus status,
            Pageable pageable
    );

    /* ==================================================
     * 3. 일반 검색 (제목 + 내용)
     * ================================================== */
    @Query("""
        select p from Post p
        where (p.title like %:keyword% or p.content like %:keyword%)
          and p.status = :status
    """)
    Page<Post> findByKeyword(
            @Param("keyword") String keyword,
            @Param("status") PostStatus status,
            Pageable pageable
    );

    /* ==================================================
     * 4. 카테고리 + 일반 검색
     * ================================================== */
    @Query("""
        select p from Post p
        where p.category.categoryId = :categoryId
          and (p.title like %:keyword% or p.content like %:keyword%)
          and p.status = :status
    """)
    Page<Post> findByCategoryAndKeyword(
            @Param("categoryId") Long categoryId,
            @Param("keyword") String keyword,
            @Param("status") PostStatus status,
            Pageable pageable
    );

    /* ==================================================
     * 5. 태그 검색
     * ================================================== */
    @Query("""
        select distinct p from Post p
        left join p.postTags pt
        left join pt.tag t
        where t.name like %:tagName%
          and p.status = :status
    """)
    Page<Post> findByTag(
            @Param("tagName") String tagName,
            @Param("status") PostStatus status,
            Pageable pageable
    );

    /* ==================================================
     * 6. 카테고리 + 태그 검색
     * ================================================== */
    @Query("""
        select distinct p from Post p
        left join p.postTags pt
        left join pt.tag t
        where p.category.categoryId = :categoryId
          and t.name like %:tagName%
          and p.status = :status
    """)
    Page<Post> findByCategoryAndTag(
            @Param("categoryId") Long categoryId,
            @Param("tagName") String tagName,
            @Param("status") PostStatus status,
            Pageable pageable
    );
}
