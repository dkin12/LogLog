package com.example.loglog.entity;

import com.example.loglog.dto.type.PostStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "log_posts")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "posts_id")
    private Long id;

    // 사용자 N:1 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = false)
    private User user;

    // 카테고리 N:1 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id",nullable = false)
    private Category category;

    @Column(nullable = false,length = 200)
    private String title;

    @Column(nullable = false,columnDefinition = "CLOB")
    private String content;

    @Column(name = "thumbnail_url",length = 200)
    private String thumbnailUrl;

    // 조회수
    @Column(name = "views",nullable = false)
    private Long views;

    // 상태값 ( enum -> string 으로 저장 )
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostStatus status;

    @CreationTimestamp
    @Column(name = "created_at",nullable = false,updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if(views == null ) this.views = 0L;
    }


    public void increaseViews() {
        this.views += 1;
    }
    public void update(String title, String content, String thumbnailUrl, Category category, PostStatus status) {
        this.title = title;
        this.content = content;
        this.thumbnailUrl = thumbnailUrl;
        this.category = category;
        this.status = status;

    }

    @Builder.Default
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "log_post_tags",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    // 태그 추가
    public void addTag(Tag tag) {
        this.tags.add(tag);
    }

    // 태그 초기화
    public void clearTags() {
        this.tags.clear();
    }

    public void update(@NotBlank(message = "제목은 필수입니다.") String title, @NotBlank(message = "본문은 필수입니다.") String content, String thumbnailUrl, @NotNull(message = "카테고리를 선택해주세요.") Long categoryId, @NotNull(message = "상태값(임시/발행/비밀글)은 필수입니다.") PostStatus status) {
    }
}
