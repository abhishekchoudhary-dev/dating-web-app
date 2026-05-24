package com.matchme.backend.user.profile;


import com.matchme.backend.user.profile.dto.UserProfileRequest;
import com.matchme.backend.user.profile.dto.UserProfileResponse;
import com.matchme.backend.user.profile.dto.UserResponse;
import com.matchme.backend.user.profile.dto.UserBioResponse;
import com.matchme.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.*;
import java.util.stream.Collectors;
import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    // Create profile endpoint mapping
    @PostMapping(value = "/users/{id}/profile", consumes = "multipart/form-data")
    public ResponseEntity<UserProfile> createProfile(
            @AuthenticationPrincipal User user,
            @Valid @ModelAttribute UserProfileRequest request) {
        UserProfile profile = userProfileService.createProfile(user, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(profile);
    }

    //update profile endpoint
    @PatchMapping(value = "/users/{id}/profile", consumes = "multipart/form-data")
    public ResponseEntity<UserProfile> updateProfile(
            @AuthenticationPrincipal User user,
            @ModelAttribute UserProfileRequest request) {
        UserProfile profile = userProfileService.updateProfile(user, request);
        return ResponseEntity.ok(profile);
    }


    // Endpoint for user with id
    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse currentUser = userProfileService.getUserById(id);
        return ResponseEntity.ok(currentUser);
    }

    //Endpoint to see user profile
    @GetMapping("/users/{id}/profile")
    public ResponseEntity<UserProfileResponse> getProfileById(@PathVariable Long id) {
        UserProfileResponse currentUserProfile = userProfileService.getProfileById(id);
        return ResponseEntity.ok(currentUserProfile);
    }

    //Endpoint for bio
    @GetMapping("users/{id}/bio")
    public ResponseEntity<UserBioResponse> getBio(@PathVariable Long id){
        UserBioResponse currentUserBio = userProfileService.getBio(id);
        return ResponseEntity.ok(currentUserBio);
    }

    //endpoint for frontend to fetch interests when user makes profile
    @GetMapping("/interests")
    public ResponseEntity<List<Map<String, String>>> getInterests() {
        List<Map<String, String>> interests = Arrays.stream(Interest.values())
                .map(i -> Map.of(
                        "name", i.name(),
                        "displayName", i.getDisplayName(),
                        "emoji", i.getEmoji()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(interests);
    }

    //endpoint for frontend to fetch languages when user makes profile
    @GetMapping("/languages")
    public ResponseEntity<List<Map<String, String>>> getLanguages() {
        List<Map<String, String>> languages = Arrays.stream(Language.values())
            .map(l -> Map.of(
                    "name", l.name(),
                    "displayName", l.getDisplayName(),
                    "emoji", l.getEmoji()
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(languages);
    }

    //Endpoint for admin dashboard
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userProfileService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}