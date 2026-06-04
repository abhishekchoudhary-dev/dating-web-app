package com.matchme.backend.user.bio.enums;

import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Map;

public interface UserBioOption {
    String getDisplayName();
    String getEmoji();

    default String getName() {
        return ((Enum<?>) this).name();
    }

    @JsonValue
    default Map<String, String> toJson() {
        return Map.of(
                "name", getName(),
                "displayName", getDisplayName(),
                "emoji", getEmoji()
        );
    }
}