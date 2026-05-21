package com.matchme.backend.user.profile.picture;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;

@Service
public class FileStorageService{
    
    @Value("${app.upload.dir}")
    private String uploadDir;

    public String saveFile(MultipartFile file,Long userId) throws IOException{
        //Create a folder for the user
        Path userFolder = Paths.get(uploadDir, "users", userId.toString())
            .toAbsolutePath()   //will convert our relative path to absolute path based on env
            .normalize();
        Files.createDirectories(userFolder);

        //Make a unique name for the current user picture to avoid overwriting
        String extension = getExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + "." + extension;

        //save the picture
        Path filePath = userFolder.resolve(filename);
        file.transferTo(filePath);

        //return the path
        return "/uploads/users/" + userId + "/" + filename;
    }

    //helper function to get the extension
    private String getExtension(String filename) {
        if (filename == null) return "jpg";
        int dotIndex = filename.lastIndexOf(".");
        return dotIndex >= 0 ? filename.substring(dotIndex + 1) : "jpg";
    }
}

