package com.matchme.backend.user.profile;


import com.matchme.backend.user.profile.dto.UserProfileRequest;
import com.matchme.backend.user.profile.dto.UserProfileResponse;
import com.matchme.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    // Create profile endpoint mapping
    @PostMapping("/profile")
    public ResponseEntity<UserProfile> createProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UserProfileRequest request) {
        UserProfile profile = userProfileService.createProfile(user, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(profile);
    }

    @PatchMapping("/profile")
    public ResponseEntity<UserProfile> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UserProfileRequest request) {
        UserProfile profile = userProfileService.updateProfile(user, request);
        return ResponseEntity.ok(profile);
    }

    // Endpoint to get a matching person
    @GetMapping("/users")
    public ResponseEntity<UserProfileResponse> getMatch(
            @AuthenticationPrincipal User user) {
        UserProfileResponse match = userProfileService.getMatch(user);
        return ResponseEntity.ok(match);
    }

    // Endpoint for user to open their profile
    @GetMapping("/users/{id}")
    public ResponseEntity<UserProfile> getProfile(@PathVariable Long id) {
        UserProfile profile = userProfileService.getProfileById(id);
        return ResponseEntity.ok(profile);
    }
}