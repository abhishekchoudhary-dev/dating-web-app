package com.matchme.backend.user.dto;

import com.matchme.backend.user.bio.dto.UserBioRequest;
import com.matchme.backend.user.profile.dto.UserProfileRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class UserFullProfileRequest {
    @Valid
    @NotNull
    private UserRequest user;

    @Valid
    @NotNull
    private UserProfileRequest profile;

    @Valid
    @NotNull
    private UserBioRequest bio;
}