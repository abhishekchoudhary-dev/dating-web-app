package com.matchme.backend.user.bio.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Gender implements UserBioOption {
    MALE("Male", ""),
    FEMALE("Female", ""),
    OTHER("Other", "");

    private final String displayName;
    private final String emoji;

    @JsonCreator
    public static Gender fromString(String name) {
        return valueOf(name);
    }
}