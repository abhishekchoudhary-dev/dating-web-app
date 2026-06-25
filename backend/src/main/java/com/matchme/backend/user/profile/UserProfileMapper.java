package com.matchme.backend.user.profile;

import com.matchme.backend.user.profile.dto.UserProfileResponse;
import org.springframework.stereotype.Component;

@Component
public class UserProfileMapper {
    public UserProfileResponse toResponse(UserProfile userProfile) {
        return UserProfileResponse.builder()
                .id(userProfile.getUser().getId())
                .aboutMe(userProfile.getAboutMe())
                .build();
    }
}