package com.matchme.backend.user.profile.dto;

import java.util.*;
import lombok.*;

@Data
@Builder
public class UserProfileResponse{
    private Long id;
    private String name;
    private String profileLink;

}
