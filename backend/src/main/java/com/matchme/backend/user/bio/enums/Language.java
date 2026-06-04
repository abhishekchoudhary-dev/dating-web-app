package com.matchme.backend.user.bio.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Language implements UserBioOption {
    ENGLISH("English", "🇬🇧"),
    ESTONIAN("Estonian", "🇪🇪"),
    HINDI("Hindi", "🇮🇳"),
    SPANISH("Spanish", "🇪🇸"),
    FRENCH("French", "🇫🇷"),
    GERMAN("German", "🇩🇪"),
    ARABIC("Arabic", "🇸🇦"),
    MANDARIN("Mandarin", "🇨🇳"),
    PORTUGUESE("Portuguese", "🇧🇷"),
    RUSSIAN("Russian", "🇷🇺"),
    JAPANESE("Japanese", "🇯🇵");

    private final String displayName;
    private final String emoji;

    @JsonCreator
    public static Language fromString(String name) {
        return valueOf(name);
    }
}