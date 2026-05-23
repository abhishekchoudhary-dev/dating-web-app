package com.matchme.backend.user.profile;

import lombok.Getter;

@Getter
public enum Language {

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

    Language(String displayName, String emoji){
        this.displayName = displayName;
        this.emoji = emoji;
    }
    
}
