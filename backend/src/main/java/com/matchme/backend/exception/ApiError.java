package com.matchme.backend.exception;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiError(
        Instant timestamp,
        int status,
        String error,
        String message,
        Map<String, List<String>> errors,
        String path
) {
    public static ApiError of(int status, String error, String message, Map<String, List<String>> errors, String path) {
        return new ApiError(Instant.now(), status, error, message, errors, path);
    }
}