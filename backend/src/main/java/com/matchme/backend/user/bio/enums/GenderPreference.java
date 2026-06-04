package com.matchme.backend.user.bio.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum GenderPreference implements UserBioOption {
    MALE("Male", ""),
    FEMALE("Female", ""),
    ANY("Any", "");

    private final String displayName;
    private final String emoji;

    @JsonCreator
    public static GenderPreference fromString(String name) {
        return valueOf(name);
    }
}