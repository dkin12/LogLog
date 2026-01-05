package com.example.loglog.controller;

import com.example.loglog.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {
    private final FileService fileService;

    @PostMapping("/image")
    public Map<String,String> uploadImage(@RequestParam("file") MultipartFile file) {
        String imageUrl = fileService.saveImage(file);
        return Map.of("imageUrl", imageUrl);
    }
}
