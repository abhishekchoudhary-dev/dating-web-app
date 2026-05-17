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
import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    // Create profile endpoint mapping
    @PostMapping("/users/{id}/profile")
    public ResponseEntity<UserProfile> createProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UserProfileRequest request) {
        UserProfile profile = userProfileService.createProfile(user, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(profile);
    }

    @PatchMapping("/users/{id}/profile")
    public ResponseEntity<UserProfile> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UserProfileRequest request) {
        UserProfile profile = userProfileService.updateProfile(user, request);
        return ResponseEntity.ok(profile);
    }


    // Endpoint for user to open their profile
    @GetMapping("/users/{id}")
    public ResponseEntity<UserProfileResponse> getUserById(@PathVariable Long id) {
        UserProfileResponse profile = userProfileService.getUserById(id);
        return ResponseEntity.ok(profile);
    }


    //Endpoint for admin dashboard
    @GetMapping("/users")
    public ResponseEntity<List<UserProfileResponse>> getAllUsers() {
        List<UserProfileResponse> users = userProfileService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}