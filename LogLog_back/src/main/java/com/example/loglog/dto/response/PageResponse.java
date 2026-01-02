package com.example.loglog.dto.response;


import lombok.*;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageResponse<T> {
    private List<T> content; // 데이터 리스트
    private int currentPage; // 현재 페이지 번호
    private int size; // 페이지 크기
    private long totalElements; // 전체 요소 수
    private long totalPages; // 전체 페이지 수

    public static <E,D> PageResponse<D> from (Page<E> page, Function<E,D> mapper) {
        List<D> content = page.getContent().stream()
                .map(mapper)
                .toList();
        return PageResponse.<D>builder()
                .content(content)
                .currentPage(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }
}
