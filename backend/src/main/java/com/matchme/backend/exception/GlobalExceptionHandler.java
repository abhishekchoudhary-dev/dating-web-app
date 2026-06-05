package com.matchme.backend.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentials(BadCredentialsException ex,
                                                         HttpServletRequest request) {
        return build(HttpStatus.UNAUTHORIZED, request, "Invalid email or password");
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiError> handleAuthentication(AuthenticationException ex,
                                                         HttpServletRequest request) {
        return build(HttpStatus.UNAUTHORIZED, request, "Authentication failed");
    }

    @ExceptionHandler(EmailAlreadyTakenException.class)
    public ResponseEntity<ApiError> handleEmailTaken(EmailAlreadyTakenException ex,
                                                     HttpServletRequest request) {
        return build(HttpStatus.CONFLICT, request, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex,
                                                     HttpServletRequest request) {
        Map<String, List<String>> errors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.groupingBy(
                        FieldError::getField,
                        Collectors.mapping(FieldError::getDefaultMessage, Collectors.toList())
                ));
        return build(HttpStatus.BAD_REQUEST, request, "Something went wrong", errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleEverythingElse(Exception ex,
                                                         HttpServletRequest request) {
        log.error("Unhandled exception at {}", request.getRequestURI(), ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, request, "Something went wrong");
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleResourceNotFound(ResourceNotFoundException ex,
                                                           HttpServletRequest request) {
        return build(HttpStatus.NOT_FOUND, request, ex.getMessage());
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<?> handleIOException(IOException ex, HttpServletRequest request) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, request, "File upload failed");
    }

    private ResponseEntity<ApiError> build(HttpStatus status, HttpServletRequest request, String message) {
        return build(status, request, message, null);
    }

    private ResponseEntity<ApiError> build(HttpStatus status, HttpServletRequest request, String message, Map<String, List<String>> errors) {
        ApiError body = ApiError.of(status.value(), status.getReasonPhrase(), message, errors, request.getRequestURI());
        return ResponseEntity.status(status).body(body);
    }
}