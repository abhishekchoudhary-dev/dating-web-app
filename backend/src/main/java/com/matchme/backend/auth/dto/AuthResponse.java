package com.matchme.backend.auth.dto;

import com.matchme.backend.auth.jwt.IssuedToken;

import java.time.Duration;
import java.time.Instant;

public record AuthResponse(String token, Instant expiresAt, long expiresIn) {
    public static AuthResponse from(IssuedToken issued) {
        long expiresIn = Math.max(0, Duration.between(Instant.now(), issued.expiresAt()).toSeconds());
        return new AuthResponse(issued.token(), issued.expiresAt(), expiresIn);
    }
}