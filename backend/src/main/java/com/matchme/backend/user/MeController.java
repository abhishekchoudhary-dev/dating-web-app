package com.matchme.backend.user;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.matchme.backend.user.profile.UserProfileService;
import com.matchme.backend.user.profile.dto.UserProfileResponse;
import com.matchme.backend.user.profile.dto.UserResponse;
import com.matchme.backend.user.profile.UserProfile;
import com.matchme.backend.user.profile.dto.UserBioResponse;
import com.matchme.backend.user.profile.dto.UserProfileRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.*;


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MeController {

    private final UserProfileService userProfileService;

    //this maps to our endpoint /users/{id} for current logged in user
    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userProfileService.getUserById(user.getId()));
    }

    //this maps to our endpoint /users/{id}/profile for current logged in user
    @GetMapping("/me/profile")
    public ResponseEntity<UserProfileResponse> myProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userProfileService.getProfileById(user.getId()));
    }

    //this maps to our endpoint /users/{id}/bio for current logged in user
    @GetMapping("/me/bio")
    public ResponseEntity<UserBioResponse> myBio(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userProfileService.getBio(user.getId()));
    }

    //this maps to endpoint /users/{id}/profile for current logged in user to create profile
    @PostMapping(value = "/me/profile", consumes = "multipart/form-data")
    public ResponseEntity<UserProfile> createProfile(
        @AuthenticationPrincipal User user,
        @Valid @ModelAttribute UserProfileRequest request){
            UserProfile profile = userProfileService.createProfile(user,request);
            return ResponseEntity.status(HttpStatus.CREATED).body(profile);
    }

    //this maps to the endpoint /users/{id}/profile for current logged in user to update profile
    @PatchMapping(value = "/me/profile", consumes = "multipart/form-data")
    public ResponseEntity<UserProfile> updateProfile(
        @AuthenticationPrincipal User user,
        @ModelAttribute UserProfileRequest request) {
            UserProfile profile = userProfileService.updateProfile(user, request);
            return ResponseEntity.ok(profile);

    }


    

}