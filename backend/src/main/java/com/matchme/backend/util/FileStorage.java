package com.matchme.backend.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorage {
    @Value("${app.uploads.dir}")
    private String uploadDirectory;

    public Path saveFile(Long userId, MultipartFile file) throws IOException {
        Files.createDirectories(Path.of(uploadDirectory));

        String extension = getExtension(file.getOriginalFilename());
        String filename = String.format("profile_%s-%s.%s", userId, System.currentTimeMillis(), extension);

        Path savePath = Path.of(uploadDirectory).resolve(filename);
        Files.copy(file.getInputStream(), savePath, StandardCopyOption.REPLACE_EXISTING);

        return savePath;
    }

    private String getExtension(String filename) {
        if (filename == null) return "";
        int dotIndex = filename.lastIndexOf(".");
        return dotIndex < 0 ? "" : filename.substring(dotIndex + 1);
    }

    public void deleteFile(String filename) throws IOException {
        Path filePath = Path.of(uploadDirectory).resolve(filename);
        Files.deleteIfExists(filePath);
    }
}