package com.matchme.backend.user.profile.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class UserProfileRequest {
    @Size(max = 300, message = "length cannot exceed 300 characters")
    private String aboutMe;
}