package com.matchme.backend.user.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class UserRequest {
    @Size(min = 2, max = 100)
    @NotNull(message = "enter name")
    private String name;
}