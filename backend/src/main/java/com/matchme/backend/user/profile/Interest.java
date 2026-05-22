package com.matchme.backend.user.profile;

import lombok.Getter;

@Getter
public enum Interest {
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

    Interest(String displayName,String emoji){
        this.displayName = displayName;
        this.emoji = emoji;

    }

}
