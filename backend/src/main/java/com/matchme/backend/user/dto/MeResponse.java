package com.matchme.backend.user.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class MeResponse {
    Long id;
    String name;
    String email;
    String profileLink;
    String profilePictureLink;
    Boolean profileComplete;
}