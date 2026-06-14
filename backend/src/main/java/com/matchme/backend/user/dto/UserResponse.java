package com.matchme.backend.user.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserResponse {
    Long id;
    String name;
    String profileLink;
    String profilePictureLink;
}