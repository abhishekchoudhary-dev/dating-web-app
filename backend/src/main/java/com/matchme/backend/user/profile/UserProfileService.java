package com.matchme.backend.user.profile;

import com.matchme.backend.user.User;
import com.matchme.backend.user.UserRepository;
import lombok.*;
import org.springframework.stereotype.*;
import java.util.*;
import java.io.*;
import com.matchme.backend.user.profile.dto.UserProfileRequest;
import com.matchme.backend.user.profile.dto.UserProfileResponse;
import com.matchme.backend.user.profile.picture.FileStorageService;
import org.springframework.web.multipart.MultipartFile;
import com.matchme.backend.exception.ResourceNotFoundException;
import com.matchme.backend.user.profile.dto.BioResponse;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserProfileService {
        private final UserRepository userRepository;
        private final UserProfileRepository userProfileRepository;
        //dependency to store pictures
        private final FileStorageService fileStorageService; 

        //create a new profile
        public UserProfile createProfile(User user, UserProfileRequest request){
                if(userProfileRepository.findByUser(user).isPresent()){
                        throw new RuntimeException("Profile already exists");
                }
                //get profile picture that came with 'request' and save it in uploads folder
                String pictureUrl = null;
                if (request.getProfilePicture() != null && !request.getProfilePicture().isEmpty()) {
                        try {
                        pictureUrl = fileStorageService.saveFile(request.getProfilePicture(), user.getId());
                        } catch (IOException e) {
                        throw new RuntimeException("Failed to upload profile picture");
                        } 
                } else  {
                        pictureUrl = "/images/placeholder.jpg";
                }


                UserProfile profile = UserProfile.builder()
                        .user(user)
                        .name(request.getName())
                        .age(request.getAge())
                        .gender(request.getGender())
                        .city(request.getCity())
                        .languages(request.getLanguages())
                        .interests(request.getInterests())
                        .genderPreference(request.getGenderPreference()!=null 
                                ? request.getGenderPreference()
                                : GenderPreference.ANY)
                        .minAgePreference(request.getMinAgePreference()!=null
                                ? request.getMinAgePreference()
                                : 18)
                        .maxAgePreference(request.getMaxAgePreference()!=null
                                ? request.getMaxAgePreference()
                                : 100)
                        .profilePictureUrl(pictureUrl)
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
                if (request.getGenderPreference() != null) profile.setGenderPreference(request.getGenderPreference());
                if (request.getMinAgePreference() != null) profile.setMinAgePreference(request.getMinAgePreference());
                if (request.getMaxAgePreference() != null) profile.setMaxAgePreference(request.getMaxAgePreference());

                //handle profile picture update
                if (request.getProfilePicture() != null && !request.getProfilePicture().isEmpty()) {
                        try {
                        String pictureUrl = fileStorageService.saveFile(request.getProfilePicture(), user.getId());
                        profile.setProfilePictureUrl(pictureUrl);
                        } catch (IOException e) {
                        throw new RuntimeException("Failed to upload profile picture");
                        }
                }
                return userProfileRepository.save(profile);
        }

    
        public UserProfileResponse getUserById(Long id) {
                User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                UserProfile profile = userProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

                return UserProfileResponse.builder()
                        .id(user.getId())
                        .name(profile.getName())
                        .profileLink("/api/users/" + user.getId())
                        .profilePictureUrl(profile.getProfilePictureUrl())
                        .build();
        }

        //for Bio endpoint
        public BioResponse getBio(Long id){
                User user = userRepository.findById(id)
                        .orElseThrow(()->new ResourceNotFoundException("User not found"));

                UserProfile profile = userProfileRepository.findByUser(user)
                        .orElseThrow(()->new ResourceNotFoundException("Profile not found"));
                
                return BioResponse.builder()
                        .id(user.getId())
                        .age(profile.getAge())
                        .gender(profile.getGender())
                        .city(profile.getCity())
                        .interests(profile.getInterests())
                        .languages(profile.getLanguages())
                        .build();

        }

        //for admin dashboard later
        public List<UserProfileResponse> getAllUsers() {
                return userProfileRepository.findAll().stream()
                .map(profile -> UserProfileResponse.builder()
                        .id(profile.getUser().getId())
                        .name(profile.getName())
                        .profileLink("/api/users/" + profile.getUser().getId())
                        .build())
                .collect(Collectors.toList());
        }
}
