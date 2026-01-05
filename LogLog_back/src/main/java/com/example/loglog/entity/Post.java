package com.example.loglog.entity;

import com.example.loglog.dto.type.PostStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(length = 200)
    private String title;

    @Column(columnDefinition = "CLOB")
    private String content;

    @Column(name = "thumbnail_url",length = 200)
    private String thumbnailUrl;

    @Column(nullable = false)
    private Long views;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostStatus status;

    @CreationTimestamp
    @Column(name = "created_at",updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ManyToMany → 중간엔티티 방식
    @Builder.Default
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PostTag> postTags = new HashSet<>();

    @PrePersist
    public void prePersist() {
        if(views == null ) this.views = 0L;
    }

    // 태그 추가
    public void addTag(Tag tag) {
        PostTag postTag = new PostTag(this, tag);
        postTags.add(postTag);
    }

    // 태그 초기화
    public void clearTags() {
        postTags.clear();
    }

    public void increaseViews() {
        this.views += 1;
    }

    public void update(String title,
                       String content,
                       String thumbnailUrl,
                       Category category,
                       PostStatus status) {

        this.title = title;
        this.content = content;
        this.thumbnailUrl = thumbnailUrl;
        this.category = category;
        this.status = status;
    }
}
