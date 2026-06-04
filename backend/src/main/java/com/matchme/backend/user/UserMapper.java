package com.matchme.backend.user;

import com.matchme.backend.user.dto.MeResponse;
import com.matchme.backend.user.dto.UserResponse;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .name(user.getName())
                .profileLink(user.getProfileLink())
                .profilePictureLink(user.getProfilePictureLink())
                .build();
    }

    public MeResponse toMeResponse(User user, Boolean profileComplete) {
        return MeResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .profileLink(user.getProfileLink())
                .profilePictureLink(user.getProfilePictureLink())
                .profileComplete(profileComplete)
                .build();
    }
}