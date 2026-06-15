package com.matchme.backend.auth.dto;

import com.matchme.backend.auth.jwt.IssuedToken;
import com.matchme.backend.auth.jwt.JwtService;
import com.matchme.backend.exception.EmailAlreadyTakenException;
import com.matchme.backend.user.User;
import com.matchme.backend.user.UserRepository;
import com.matchme.backend.user.bio.UserBioService;
import com.matchme.backend.user.profile.UserProfileService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserProfileService userProfileService;
    private final UserBioService userBioService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new EmailAlreadyTakenException("Email already in use: " + request.email());
        }

        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .build();

        User saved = userRepository.save(user);
        saved.setProfileLink(frontendUrl + "/profile/" + user.getId());
        userRepository.save(saved);

        userProfileService.createEmpty(saved);
        userBioService.createEmpty(saved);

        IssuedToken token = jwtService.generateToken(saved.getEmail());
        return AuthResponse.from(token);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        IssuedToken token = jwtService.generateToken(request.email());
        return AuthResponse.from(token);
    }

}