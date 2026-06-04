package com.matchme.backend.user;

import com.matchme.backend.exception.FileStorageException;
import com.matchme.backend.exception.ResourceNotFoundException;
import com.matchme.backend.user.bio.UserBio;
import com.matchme.backend.user.bio.UserBioRepository;
import com.matchme.backend.user.dto.MeResponse;
import com.matchme.backend.user.dto.UserRequest;
import com.matchme.backend.user.dto.UserResponse;
import com.matchme.backend.user.profile.UserProfile;
import com.matchme.backend.user.profile.UserProfileRepository;
import com.matchme.backend.util.FileStorage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserBioRepository userBioRepository;
    private final UserMapper userMapper;
    private final FileStorage fileStorage;

    @Value("${app.backend.url}")
    private String backendUrl;

    public MeResponse getMe(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("user not found for id: " + userId));
        return userMapper.toMeResponse(user, isProfileComplete(userId));
    }

    public UserResponse get(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("user not found for id: " + userId));
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse update(Long userId, UserRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("user not found for id: " + userId));

        user.setName(request.getName());

        User updated = userRepository.save(user);

        return userMapper.toResponse(updated);
    }

    public UserResponse updateProfilePicture(Long userId, MultipartFile picture) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("user not found for id: " + userId));

        String oldFilename = user.getProfilePictureLink() != null
                ? user.getProfilePictureLink().substring(user.getProfilePictureLink().lastIndexOf("/") + 1)
                : null;

        Path profilePicturePath;
        try {
            profilePicturePath = fileStorage.saveFile(userId, picture);

            if (oldFilename != null) {
                fileStorage.deleteFile(oldFilename);
            }
        } catch (IOException ex) {
            throw new FileStorageException("profile picture upload failed");
        }

        user.setProfilePictureLink(backendUrl + "/" + profilePicturePath.toString());

        userRepository.save(user);

        return userMapper.toResponse(user);
    }

    public boolean isProfileComplete(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("user not found for id: " + userId));
        UserProfile profile = userProfileRepository.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("user profile not found for id: " + userId));
        UserBio bio = userBioRepository.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("user bio not found for id: " + userId));

        return user.getName() != null && bio.isComplete() && profile.isComplete();
    }
}