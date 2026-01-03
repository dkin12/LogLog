package com.example.loglog.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "log_tags")
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tag_id")
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    // PostTag 와 연결
    @OneToMany(mappedBy = "tag")
    private Set<PostTag> postTags = new HashSet<>();

    public Tag(String name) {
        this.name = name;
    }
}