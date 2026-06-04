package com.matchme.backend.auth.jwt;

import java.time.Instant;

public record IssuedToken(String token, Instant expiresAt) {}