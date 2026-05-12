package com.matchme.backend.profile;

import com.matchme.backend.user.User;
import lombok.*;
import org.springframework.stereotype.*;
import java.util.*;
import com.matchme.backend.profile.dto.UserProfileRequest;
import com.matchme.backend.profile.dto.UserProfileResponse;

@RequiredArgsConstructor
@Service
public class UserProfileService {
    private final UserProfileRepository userProfileRepository;
    private final InterestRepository interestRepository;

    //create a new profile or save an existing profile after updates 
    public UserProfile saveProfile(User user, UserProfileRequest request){
        UserProfile profile = userProfileRepository.findByUser(user)
                .orElse(UserProfile.builder().user(user).build());

        List<Interest> interests = interestRepository.findAllById(request.getInterestIds());

        profile.setName(request.getName());
        profile.setAge(request.getAge());
        profile.setGender(request.getGender());
        profile.setCity(request.getCity());
        profile.setLanguages(request.getLanguages());
        profile.setInterests(interests);

        return userProfileRepository.save(profile);
    }
     // Function to Find a match for a user who is logged in
    public UserProfileResponse getMatch(User user) {
        UserProfile currentProfile = userProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Complete your profile first"));

        List<UserProfile> matches = userProfileRepository
                .findMatchByInterests(currentProfile.getInterests(), currentProfile.getId());

        if (matches.isEmpty()) {
            throw new RuntimeException("No matches found");
        }

        UserProfile match = matches.get(0);
        return UserProfileResponse.builder()
                .name(match.getName())
                .profileLink("/api/profile/" + match.getId())
                .build();
    }
    public UserProfile getProfileById(Long id) {
    return userProfileRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profile not found"));
}
}
