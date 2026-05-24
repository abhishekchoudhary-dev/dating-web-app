package com.matchme.backend.user.profile.dto;

import lombok.*;
import com.matchme.backend.user.profile.Interest;
import com.matchme.backend.user.profile.Language;
import com.matchme.backend.user.profile.Gender;
import com.matchme.backend.user.profile.GenderPreference;
import java.util.List;

@Data
@Builder
public class UserBioResponse{
    private Long id;
    private Integer age;
    private Gender gender;
    private String city;
    private List<Interest> interests;
    private List<Language> languages;
    private GenderPreference genderPreference;
    private Integer minAgePreference;
    private Integer maxAgePreference;
}