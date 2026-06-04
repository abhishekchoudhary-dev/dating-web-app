package com.matchme.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank
        @Email(message = "invalid e-mail address")
        String email,

        @NotBlank
        @Size(min = 8, max = 100)
        String password
) {}