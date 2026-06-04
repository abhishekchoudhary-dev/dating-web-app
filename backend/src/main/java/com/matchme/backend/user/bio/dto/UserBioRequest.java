package com.matchme.backend.user.bio.dto;

import com.matchme.backend.user.bio.enums.Gender;
import com.matchme.backend.user.bio.enums.GenderPreference;
import com.matchme.backend.user.bio.enums.Interest;
import com.matchme.backend.user.bio.enums.Language;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import org.hibernate.validator.constraints.Range;

import java.util.List;

@Getter
public class UserBioRequest {
    @NotNull(message = "enter age")
    @Range(min = 18, max = 100)
    private Integer age;

    @NotNull(message = "select gender")
    private Gender gender;

    @NotNull(message = "select interest")
    @Size(min = 1, max = 5, message = "select 1 to 5 interests")
    private List<Interest> interests;

    @NotNull(message = "select language")
    @Size(min = 1, max = 3, message = "select 1 to 3 languages")
    private List<Language> languages;

    @NotNull(message = "enter location")
    private String location;

    // Preferences
    @NotNull(message = "select min preferred age")
    @Range(min = 18, max = 100)
    private Integer preferenceAgeMin;

    @NotNull(message = "select max preferred age")
    @Range(min = 18, max = 100)
    private Integer preferenceAgeMax;

    @NotNull(message = "select preferred distance radius")
    @Range(min = 1, max = 100)
    private Integer preferenceDistanceRadius;

    @NotNull(message = "select preferred gender")
    private GenderPreference preferenceGender;
}