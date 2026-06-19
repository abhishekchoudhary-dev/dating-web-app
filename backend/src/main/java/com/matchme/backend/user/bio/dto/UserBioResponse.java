package com.matchme.backend.user.bio.dto;

import com.matchme.backend.user.bio.enums.Gender;
import com.matchme.backend.user.bio.enums.GenderPreference;
import com.matchme.backend.user.bio.enums.Interest;
import com.matchme.backend.user.bio.enums.Language;
import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class UserBioResponse {
    Integer age;
    Gender gender;
    List<Interest> interests;
    List<Language> languages;
    String location;
}