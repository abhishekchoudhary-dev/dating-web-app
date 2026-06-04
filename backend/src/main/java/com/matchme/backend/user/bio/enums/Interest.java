package com.matchme.backend.user.bio.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Interest implements UserBioOption {
    MUSIC("Music", "🎵"),
    TRAVEL("Travel", "🌍"),
    GAMING("Gaming", "🎮"),
    COOKING("Cooking", "🍳"),
    SPORTS("Sports", "⚽"),
    READING("Reading", "📚"),
    FITNESS("Fitness", "💪"),
    PHOTOGRAPHY("Photography", "📷"),
    ART("Art", "🎨"),
    TECHNOLOGY("Technology", "💻"),
    MOVIES("Movies", "🎬"),
    HIKING("Hiking", "🏔️"),
    DANCING("Dancing", "💃"),
    FOOD("Food", "🍕"),
    PETS("Pets", "🐾");

    private final String displayName;
    private final String emoji;

    @JsonCreator
    public static Interest fromString(String name) {
        return valueOf(name);
    }
}