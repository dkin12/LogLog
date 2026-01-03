package com.example.loglog.controller;

import com.example.loglog.entity.Category;
import com.example.loglog.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/category")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getCategoryList() {
        List<Category> categories = categoryService.getCategories();
        return ResponseEntity.ok(categories);
    }
}
