package com.matchme.backend.user.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class UserRequest {
    @Size(max = 100, message = "length cannot exceed 100 characters")
    @NotNull(message = "enter name")
    private String name;
}