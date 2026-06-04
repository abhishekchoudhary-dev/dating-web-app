package com.matchme.backend.user.bio.dto;

public record UserBioOptionResponse(
        String name,
        String displayName,
        String emoji
) {}