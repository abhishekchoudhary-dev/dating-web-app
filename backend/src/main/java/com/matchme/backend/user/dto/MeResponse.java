package com.matchme.backend.user.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class MeResponse {
    String name;
    String email;
    String profileLink;
    String profilePictureLink;
    Boolean profileComplete;
}