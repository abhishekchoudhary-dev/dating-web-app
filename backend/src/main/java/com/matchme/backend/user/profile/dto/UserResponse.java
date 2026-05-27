package com.matchme.backend.user.profile.dto;

import java.util.*;
import lombok.*;

@Data
@Builder
public class UserResponse{
    private Long id;
    private String name;
    private String profileLink;
    private String profilePictureUrl;
    private boolean profileComplete;

}
