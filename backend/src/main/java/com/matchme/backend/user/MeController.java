package com.matchme.backend.user;

import com.matchme.backend.user.bio.UserBioService;
import com.matchme.backend.user.bio.dto.UserBioResponse;
import com.matchme.backend.user.bio.enums.UserBioOption;
import com.matchme.backend.user.dto.*;
import com.matchme.backend.user.profile.UserProfileService;
import com.matchme.backend.user.profile.dto.UserProfileResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
public class MeController {
    private final UserProfileService userProfileService;
    private final UserBioService userBioService;
    private final UserService userService;

    // USER
    @GetMapping
    public ResponseEntity<MeResponse> getMe(@AuthenticationPrincipal User user) {
        MeResponse me = userService.getMe(user.getId());
        return ResponseEntity.ok(me);
    }

    @PutMapping
    public ResponseEntity<UserFullProfileResponse> putMe(@AuthenticationPrincipal User user, @Valid @RequestBody UserFullProfileRequest request) {
        UserFullProfileResponse profile = userService.putMe(user.getId(), request);
        return ResponseEntity.ok(profile);
    }

    @PutMapping(value = "/profile-picture", consumes = "multipart/form-data")
    public ResponseEntity<UserResponse> updateMeProfilePicture(@AuthenticationPrincipal User user, @RequestParam("file") MultipartFile file) {
        UserResponse me = userService.updateProfilePicture(user.getId(), file);
        return ResponseEntity.ok(me);
    }

    @DeleteMapping(value = "/profile-picture")
    public ResponseEntity<UserResponse> deleteMeProfilePicture(@AuthenticationPrincipal User user) {
        UserResponse me = userService.deleteProfilePicture(user.getId());
        return ResponseEntity.ok(me);
    }

    // PROFILE
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getMeProfile(@AuthenticationPrincipal User user) {
        UserProfileResponse profile = userProfileService.get(user.getId());
        return ResponseEntity.ok(profile);
    }

    // BIO
    @GetMapping("/bio")
    public ResponseEntity<UserBioResponse> getMeBio(@AuthenticationPrincipal User user) {
        UserBioResponse bio = userBioService.get(user.getId());
        return ResponseEntity.ok(bio);
    }

    @GetMapping("/bio/options")
    public ResponseEntity<Map<String, List<? extends UserBioOption>>> getMeBioOptions() {
        return ResponseEntity.ok(userBioService.getOptions());
    }
}