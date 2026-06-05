package com.matchme.backend.user.dto;

import com.matchme.backend.user.bio.dto.UserBioResponse;
import com.matchme.backend.user.profile.dto.UserProfileResponse;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserFullProfileResponse {
    UserResponse user;
    UserProfileResponse profile;
    UserBioResponse bio;
}