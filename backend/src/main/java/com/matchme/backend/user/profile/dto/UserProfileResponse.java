package com.matchme.backend.user.profile.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileResponse {
    private Long id;
    private String aboutMe;
}
