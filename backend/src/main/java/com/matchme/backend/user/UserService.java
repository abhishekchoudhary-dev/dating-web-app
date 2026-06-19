package com.matchme.backend.user;

import com.matchme.backend.exception.FileStorageException;
import com.matchme.backend.exception.ResourceNotFoundException;
import com.matchme.backend.user.bio.UserBio;
import com.matchme.backend.user.bio.UserBioMapper;
import com.matchme.backend.user.bio.UserBioRepository;
import com.matchme.backend.user.connection.ConnectionRepository;
import com.matchme.backend.user.connection.enums.ConnectionStatus;
import com.matchme.backend.user.dto.*;
import com.matchme.backend.user.profile.UserProfile;
import com.matchme.backend.user.profile.UserProfileMapper;
import com.matchme.backend.user.profile.UserProfileRepository;
import com.matchme.backend.user.recommendation.RecommendationService;
import com.matchme.backend.util.FileStorage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.matchme.backend.user.chat.MessageService;
import org.springframework.context.annotation.Lazy;

import java.io.IOException;
import java.nio.file.Path;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserBioRepository userBioRepository;
    private final ConnectionRepository connectionRepository;
    private final UserMapper userMapper;
    private final FileStorage fileStorage;
    private final UserFullProfileMapper userFullProfileMapper;
    private final UserProfileMapper userProfileMapper;
    private final UserBioMapper userBioMapper;
    @Lazy
    private final MessageService messageService;
    private final RecommendationService recommendationService;

    @Value("${app.backend.url}")
    private String backendUrl;

    public MeResponse getMe(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("user not found for id: " + userId));
        UserProfile profile = userProfileRepository.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("profile not found for id: " + userId));
        UserBio bio = userBioRepository.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("bio not found for id: " + userId));

        return userMapper.toMeResponse(user, isProfileComplete(user, profile, bio));
    }

    @Transactional
    public UserFullProfileResponse putMe(Long userId, UserFullProfileRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("user not found for id: " + userId));
        UserProfile profile = userProfileRepository.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("profile not found for id: " + userId));
        UserBio bio = userBioRepository.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("bio not found for id: " + userId));

        // User
        user.setName(request.getUser().getName());

        // Profile
        profile.setAboutMe(request.getProfile().getAboutMe());

        // Bio
        bio.setAge(request.getBio().getAge());
        bio.setGender(request.getBio().getGender());
        bio.setInterests(request.getBio().getInterests());
        bio.setLanguages(request.getBio().getLanguages());
        bio.setLocation(request.getBio().getLocation());
        bio.setPreferenceAgeMin(request.getBio().getPreferenceAgeMin());
        bio.setPreferenceAgeMax(request.getBio().getPreferenceAgeMax());
        bio.setPreferenceDistanceRadius(request.getBio().getPreferenceDistanceRadius());
        bio.setPreferenceGender(request.getBio().getPreferenceGender());

        return userFullProfileMapper.toResponse(
                userMapper.toResponse(user),
                userProfileMapper.toResponse(profile),
                userBioMapper.toResponse(bio)
        );
    }

    public UserResponse get(Long userId, User authenticatedUser) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("user not found for id: " + userId));

        if (!areMatchedOrRecommended(user, authenticatedUser)) throw new ResourceNotFoundException("user not found for id: " + userId);

        return userMapper.toResponse(user);
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

    public UserResponse deleteProfilePicture(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("user not found for id: " + userId));

        if (user.getProfilePictureLink() == null) {
            return userMapper.toResponse(user);
        }

        String filename = user.getProfilePictureLink().substring(user.getProfilePictureLink().lastIndexOf("/") + 1);

        try {
            fileStorage.deleteFile(filename);
        } catch (IOException ex) {
            throw new FileStorageException("profile picture deletion failed");
        }

        user.setProfilePictureLink(null);
        userRepository.save(user);

        return userMapper.toResponse(user);
    }

    public boolean isProfileComplete(User user, UserProfile profile, UserBio bio) {
        return user.isComplete() && bio.isComplete() && profile.isComplete();
    }

    @Transactional
    public void toggleHideOnlineStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setHideOnlineStatus(!user.isHideOnlineStatus());
        userRepository.save(user);
        //we meed to broadcase herer??
        // Broadcast status change immediately
        if (user.isHideOnlineStatus()) {
            // Just turned on hiding — broadcast as offline
            messageService.broadcastStatus(userId, false);
        } else {
            // Just turned off hiding — broadcast as online if connected
            if (messageService.isOnline(userId)) {
                messageService.broadcastStatus(userId, true);
            }
        }
    }

    public boolean areMatchedOrRecommended(User requestedUser, User authenticatedUser) {
        // Check if requested user and authenticated user are matched
        boolean areMatched = connectionRepository.findBetweenUsersByStatus(requestedUser.getId(), authenticatedUser.getId(), ConnectionStatus.MATCHED).isPresent();
        if (areMatched) return true;

        // Check if requested user is recommended for the authenticated user
        return recommendationService.getRecommendations(authenticatedUser).contains(requestedUser.getId());
    }
}