package com.matchme.backend.user;

import com.matchme.backend.user.bio.dto.UserBioResponse;
import com.matchme.backend.user.dto.UserFullProfileResponse;
import com.matchme.backend.user.dto.UserResponse;
import com.matchme.backend.user.profile.dto.UserProfileResponse;
import org.springframework.stereotype.Component;

@Component
public class UserFullProfileMapper {
    public UserFullProfileResponse toResponse(UserResponse user, UserProfileResponse profile, UserBioResponse bio) {
        return UserFullProfileResponse.builder()
                .user(user)
                .profile(profile)
                .bio(bio)
                .build();
    }
}
