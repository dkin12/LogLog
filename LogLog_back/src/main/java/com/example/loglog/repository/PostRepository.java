package com.example.loglog.repository;

import com.example.loglog.dto.type.PostStatus;
import com.example.loglog.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    // 1. 전체 조회 (PUBLISHED만)
    @Query("""
        select p
        from Post p
        where p.status = :status
    """)
    Page<Post> findAllByStatus(
            @Param("status") PostStatus status,
            Pageable pageable
    );

    // 2. 카테고리 필터
    @Query("""
        select p
        from Post p
        where p.category.categoryId = :categoryId
          and p.status = :status
    """)
    Page<Post> findByCategory(
            @Param("categoryId") Long categoryId,
            @Param("status") PostStatus status,
            Pageable pageable
    );

    // 3. 일반 검색 (제목 + 내용)
    @Query("""
        select p
        from Post p
        where (p.title like %:keyword% or p.content like %:keyword%)
          and p.status = :status
    """)
    Page<Post> findByKeyword(
            @Param("keyword") String keyword,
            @Param("status") PostStatus status,
            Pageable pageable
    );

    // 4. 카테고리 + 일반 검색
    @Query("""
        select p
        from Post p
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

    // 5. 태그 검색 (ID 먼저 조회 — Oracle 안전)
    @Query("""
        select distinct p.id
        from Post p
        join p.postTags pt
        join pt.tag t
        where p.status = :status
          and t.name like concat('%', :tagName, '%')
    """)
    Page<Long> findPostIdsByTag(
            @Param("tagName") String tagName,
            @Param("status") PostStatus status,
            Pageable pageable
    );

    // 6. 카테고리 + 태그 검색 (ID 먼저)
    @Query("""
        select distinct p.id
        from Post p
        join p.postTags pt
        join pt.tag t
        where p.status = :status
          and p.category.categoryId = :categoryId
          and t.name like concat('%', :tagName, '%')
    """)
    Page<Long> findPostIdsByCategoryAndTag(
            @Param("categoryId") Long categoryId,
            @Param("tagName") String tagName,
            @Param("status") PostStatus status,
            Pageable pageable
    );

    // 7. ID 리스트로 Post 조회
    @Query("""
        select p
        from Post p
        where p.id in :ids
        order by p.createdAt desc
    """)
    List<Post> findAllByIdIn(@Param("ids") List<Long> ids);
}

