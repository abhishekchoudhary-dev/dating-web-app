package com.matchme.backend.user.bio;

import com.matchme.backend.user.bio.dto.MeBioResponse;
import com.matchme.backend.user.bio.dto.UserBioResponse;
import org.springframework.stereotype.Component;

@Component
public class UserBioMapper {
    public UserBioResponse toResponse(UserBio userBio) {
        return UserBioResponse.builder()
                .id(userBio.getUser().getId())
                .age(userBio.getAge())
                .gender(userBio.getGender())
                .interests(userBio.getInterests())
                .languages(userBio.getLanguages())
                .location(userBio.getLocation())
                .build();
    }

    public MeBioResponse toMeResponse(UserBio userBio) {
        return MeBioResponse.builder()
                .age(userBio.getAge())
                .gender(userBio.getGender())
                .interests(userBio.getInterests())
                .languages(userBio.getLanguages())
                .location(userBio.getLocation())
                .preferenceAgeMin(userBio.getPreferenceAgeMin())
                .preferenceAgeMax(userBio.getPreferenceAgeMax())
                .preferenceDistanceRadius(userBio.getPreferenceDistanceRadius())
                .preferenceGender(userBio.getPreferenceGender())
                .build();
    }
}