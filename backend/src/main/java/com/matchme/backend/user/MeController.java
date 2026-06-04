package com.matchme.backend.user;

import com.matchme.backend.user.bio.UserBioService;
import com.matchme.backend.user.bio.dto.UserBioRequest;
import com.matchme.backend.user.bio.dto.UserBioResponse;
import com.matchme.backend.user.bio.enums.UserBioOption;
import com.matchme.backend.user.dto.MeResponse;
import com.matchme.backend.user.dto.UserRequest;
import com.matchme.backend.user.dto.UserResponse;
import com.matchme.backend.user.profile.UserProfileService;
import com.matchme.backend.user.profile.dto.UserProfileRequest;
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

    @PatchMapping
    public ResponseEntity<UserResponse> updateMe(@AuthenticationPrincipal User user, @Valid @RequestBody UserRequest request) {
        UserResponse me = userService.update(user.getId(), request);
        return ResponseEntity.ok(me);
    }

    @PutMapping(value = "/profile-picture", consumes = "multipart/form-data")
    public ResponseEntity<UserResponse> updateMeProfilePicture(@AuthenticationPrincipal User user, @RequestParam("file") MultipartFile file) {
        UserResponse me = userService.updateProfilePicture(user.getId(), file);
        return ResponseEntity.ok(me);
    }

    // PROFILE
    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateMeProfile(@AuthenticationPrincipal User user, @Valid @RequestBody UserProfileRequest request) {
        UserProfileResponse profile = userProfileService.update(user.getId(), request);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getMeProfile(@AuthenticationPrincipal User user) {
        UserProfileResponse profile = userProfileService.get(user.getId());
        return ResponseEntity.ok(profile);
    }

    // BIO
    @PutMapping("/bio")
    public ResponseEntity<UserBioResponse> updateMeBio(@AuthenticationPrincipal User user, @Valid @RequestBody UserBioRequest request) {
        UserBioResponse bio = userBioService.update(user.getId(), request);
        return ResponseEntity.ok(bio);
    }

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