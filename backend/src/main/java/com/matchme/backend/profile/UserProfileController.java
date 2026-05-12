package com.matchme.backend.profile;


import com.matchme.backend.profile.dto.UserProfileRequest;
import com.matchme.backend.profile.dto.UserProfileResponse;
import com.matchme.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    // Create or update profile
    @PostMapping("/profile")
    public ResponseEntity<UserProfile> saveProfile(
            @AuthenticationPrincipal User user,
            @RequestBody UserProfileRequest request) {
        UserProfile profile = userProfileService.saveProfile(user, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(profile);
    }

    // Get one recommended match
    @GetMapping("/users")
    public ResponseEntity<UserProfileResponse> getMatch(
            @AuthenticationPrincipal User user) {
        UserProfileResponse match = userProfileService.getMatch(user);
        return ResponseEntity.ok(match);
    }

    // Get full profile by id
    @GetMapping("/users/{id}")
    public ResponseEntity<UserProfile> getProfile(@PathVariable Long id) {
        UserProfile profile = userProfileService.getProfileById(id);
        return ResponseEntity.ok(profile);
    }
}