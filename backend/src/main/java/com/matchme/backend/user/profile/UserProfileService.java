package com.matchme.backend.user.profile;

import com.matchme.backend.user.User;
import com.matchme.backend.user.UserRepository;
import lombok.*;
import org.springframework.stereotype.*;
import java.util.*;
import com.matchme.backend.user.profile.dto.UserProfileRequest;
import com.matchme.backend.user.profile.dto.UserProfileResponse;

@RequiredArgsConstructor
@Service
public class UserProfileService {
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    //create a new profile
     public UserProfile createProfile(User user, UserProfileRequest request){
        if(userProfileRepository.findByUser(user).isPresent()){
                throw new RuntimeException("Profile already exists");
        }


        UserProfile profile = UserProfile.builder()
                .user(user)
                .name(request.getName())
                .age(request.getAge())
                .gender(request.getGender())
                .city(request.getCity())
                .languages(request.getLanguages())
                .interests(request.getInterests())
                .build();

        return userProfileRepository.save(profile);

     }

     public UserProfile updateProfile(User user, UserProfileRequest request){
        UserProfile profile = userProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        if (request.getName()!=null) profile.setName(request.getName());
        if (request.getAge()!=null) profile.setAge(request.getAge());
        if (request.getGender()!=null) profile.setGender(request.getGender());
        if (request.getCity()!=null) profile.setCity(request.getCity());
        if (request.getLanguages()!=null) profile.setLanguages(request.getLanguages());
        if (request.getInterests()!=null) profile.setInterests(request.getInterests());

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
