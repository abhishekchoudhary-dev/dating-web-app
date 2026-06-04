package com.matchme.backend.auth;

import com.matchme.backend.auth.dto.AuthResponse;
import com.matchme.backend.auth.dto.AuthService;
import com.matchme.backend.auth.dto.LoginRequest;
import com.matchme.backend.auth.dto.RegisterRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.time.Instant;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${app.cookie.access-token-name}")
    private String accessTokenCookieName;

    @Value("${app.cookie.secure}")
    private boolean cookieSecure;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request, HttpServletResponse response) {
        AuthResponse body = authService.register(request);
        writeAccessCookie(response, body);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AuthResponse body = authService.login(request);
        writeAccessCookie(response, body);
        return ResponseEntity.status(HttpStatus.OK).body(body);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        clearAccessCookie(response);
        return ResponseEntity.noContent().build();
    }

    private void writeAccessCookie(HttpServletResponse response, AuthResponse body) {
        long maxAgeSeconds = Math.max(0, Duration.between(Instant.now(), body.expiresAt()).toSeconds());
        response.addHeader(HttpHeaders.SET_COOKIE,
                buildAccessCookie(body.token(), maxAgeSeconds).toString());
    }

    private void clearAccessCookie(HttpServletResponse response) {
        response.addHeader(HttpHeaders.SET_COOKIE, buildAccessCookie("", 0).toString());
    }

    private ResponseCookie buildAccessCookie(String value, long maxAgeSeconds) {
        return ResponseCookie.from(accessTokenCookieName, value)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Lax")
                .path("/")
                .maxAge(maxAgeSeconds)
                .build();
    }
}