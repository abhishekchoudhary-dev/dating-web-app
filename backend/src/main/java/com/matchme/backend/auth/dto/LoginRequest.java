package com.matchme.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank
        @Email(message = "invalid e-mail address")
        String email,

        @NotBlank
        String password
) {}

