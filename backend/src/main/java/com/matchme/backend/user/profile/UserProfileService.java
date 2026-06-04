package com.matchme.backend.user.profile;

import com.matchme.backend.exception.ResourceNotFoundException;
import com.matchme.backend.user.User;
import com.matchme.backend.user.profile.dto.UserProfileRequest;
import com.matchme.backend.user.profile.dto.UserProfileResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserProfileService {
    private final UserProfileRepository userProfileRepository;
    private final UserProfileMapper userProfileMapper;

    @Transactional
    public void createEmpty(User user) {
        userProfileRepository.save(new UserProfile(user));
    }

    @Transactional
    public UserProfileResponse update(Long userId, UserProfileRequest request) {
        UserProfile profile = userProfileRepository.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("user profile not found for id: " + userId));

        profile.setAboutMe(request.getAboutMe());
        UserProfile updated = userProfileRepository.save(profile);

        return userProfileMapper.toResponse(updated);
    }

    public UserProfileResponse get(Long userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("user profile not found for id: " + userId));
        return userProfileMapper.toResponse(profile);
    }
}