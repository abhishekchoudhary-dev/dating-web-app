package com.matchme.backend.user;

import com.matchme.backend.user.bio.UserBioService;
import com.matchme.backend.user.bio.dto.UserBioResponse;
import com.matchme.backend.user.dto.UserResponse;
import com.matchme.backend.user.profile.UserProfileService;
import com.matchme.backend.user.profile.dto.UserProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserBioService userBioService;
    private final UserProfileService userProfileService;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.get(id));
    }

    @GetMapping("/{id}/bio")
    public ResponseEntity<UserBioResponse> getUserBio(@PathVariable Long id) {
        return ResponseEntity.ok(userBioService.get(id));
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userProfileService.get(id));
    }
}
