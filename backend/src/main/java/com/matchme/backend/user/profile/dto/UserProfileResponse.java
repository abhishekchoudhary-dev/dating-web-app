package com.matchme.backend.user.profile.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserProfileResponse {
    Long id;
    String aboutMe;
}