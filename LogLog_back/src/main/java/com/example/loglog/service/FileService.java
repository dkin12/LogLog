package com.example.loglog.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    // 저장
    public String saveImage(MultipartFile file) {
        // 파일 존재에 대한 검증
        if(file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NO_CONTENT,"File is empty");
        }


        try{
            // 업로드 ( 절대 ) 경로 생성
            Path uploadPath =  Paths.get(uploadDir).toAbsolutePath().normalize();
            log.info("Uploading file {} to path {}", file.getOriginalFilename(), uploadPath);
            // 폴더가 없으면 생성
            if(!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 안전하게 작업 가능
            // 확장자 추출 .png, .jpg .. 등
            String originalFilename = file.getOriginalFilename();
            String ext = "";
            int idx = originalFilename.lastIndexOf('.');
            // 문자열에서 해당 글자가 마지막으로 나온 위치를 찾음
            // 숫자로 반환
            if (idx > 0) {
                // idx 위치부터 끝까지 자름
                ext = originalFilename.substring(idx );
            }

            // 새 파일 명 : uuid + 확장자
            String newFileName = UUID.randomUUID().toString()+ ext;

            // uploadPath : **/**/uploads/images
            // newName :123.png
            // uploadPath + newName -> **/**/uploads/images/123.png
            Path target =  uploadPath.resolve(newFileName);

            // 실제 저장 한 번만 호출해야하는? 해야함
            // 분리되어있는걸 합치는 것을 해주는

            file.transferTo(target.toFile());
            // 프론트에서 사용할 URL 반환.{} json 값으로 들어갈 url
            return "/images/" + newFileName;
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"File upload failed");
        }



    }

    // 삭제
    public void deleteImage(String imageUrl){
        if(imageUrl == null || imageUrl.isBlank()) {

            // "images/파일명" -> 파일 명
            String fileName = imageUrl.replace("/images","");

            Path uploadPath =  Paths.get(uploadDir).toAbsolutePath().normalize();
            Path targert = uploadPath.resolve(fileName);

            try {
                Files.deleteIfExists(targert);
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"이미지 삭제 중 오류 발생");
            }
        }
    }

}

