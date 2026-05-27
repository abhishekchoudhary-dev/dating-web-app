package com.matchme.backend.user.profile;

import com.matchme.backend.BackendApplication;
import com.matchme.backend.user.User;
import com.matchme.backend.user.UserRepository;
import lombok.*;
import org.springframework.stereotype.*;
import java.util.*;
import java.io.*;
import com.matchme.backend.user.profile.dto.UserProfileRequest;
import com.matchme.backend.user.profile.dto.UserResponse;
import com.matchme.backend.user.profile.dto.UserProfileResponse;
import com.matchme.backend.user.profile.dto.UserBioResponse;
import com.matchme.backend.user.profile.picture.FileStorageService;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import com.matchme.backend.exception.ResourceNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserProfileService {
        
        private final UserRepository userRepository;
        private final UserProfileRepository userProfileRepository;
        private final UserBioRepository userBioRepository;
        //dependency to store pictures
        private final FileStorageService fileStorageService;

        @Value("${app.server.url}")
        private String serverUrl;

        //create a new profile
        @Transactional
        public UserProfile createProfile(User user, UserProfileRequest request){
                if(userProfileRepository.findByUser(user).isPresent()){
                        throw new RuntimeException("Profile already exists");
                }
                //get profile picture that came with 'request' and save it in uploads folder
                String pictureUrl = null;
                if (request.getProfilePicture() != null && !request.getProfilePicture().isEmpty()) {
                        try {
                        pictureUrl = serverUrl + fileStorageService.saveFile(request.getProfilePicture(), user.getId());
                        } catch (IOException e) {
                        throw new RuntimeException("Failed to upload profile picture");
                        } 
                } else  {
                        pictureUrl = serverUrl + "/images/placeholder.jpg";
                }

                //save user profile
                UserProfile profile = UserProfile.builder()
                        .user(user)
                        .name(request.getName())
                        .profilePictureUrl(pictureUrl)
                        .aboutMe(request.getAboutMe())
                        .build();
                userProfileRepository.save(profile);

                //save user bio
                UserBio bio = UserBio.builder()
                        .user(user)
                        .age(request.getAge())
                        .gender(request.getGender())
                        .city(request.getCity())
                        .interests(request.getInterests())
                        .languages(request.getLanguages())
                        .genderPreference(request.getGenderPreference() != null
                        ? request.getGenderPreference()
                        : GenderPreference.ANY)
                        .minAgePreference(request.getMinAgePreference() != null
                        ? request.getMinAgePreference()
                        : 18)
                        .maxAgePreference(request.getMaxAgePreference() != null
                        ? request.getMaxAgePreference()
                        : 100)
                        .build();
                userBioRepository.save(bio);

                //mark user profile as complete if all required fields are filled
                user.setProfileComplete(true);
                userRepository.save(user);

                return profile;

        }

        //update profile
        @Transactional
        public UserProfile updateProfile(User user, UserProfileRequest request){
                UserProfile profile = userProfileRepository.findByUser(user)
                        .orElseThrow(() -> new RuntimeException("Profile not found"));
                
                UserBio bio = userBioRepository.findByUser(user)
                        .orElseThrow(() -> new RuntimeException("Bio not found"));

                //first we update relevant userProfile fields        
                if (request.getName()!=null) profile.setName(request.getName());
                if (request.getAboutMe() != null) profile.setAboutMe(request.getAboutMe());

                //handle profile picture update for the userProfile entity
                if (request.getProfilePicture() != null && !request.getProfilePicture().isEmpty()) {
                        try {
                        String pictureUrl = serverUrl  + fileStorageService.saveFile(request.getProfilePicture(), user.getId());
                        profile.setProfilePictureUrl(pictureUrl);
                        } catch (IOException e) {
                        throw new RuntimeException("Failed to upload profile picture");
                        }
                }
                userProfileRepository.save(profile);

                //now update the userBio fields if they are present in the request
                if (request.getAge()!=null) bio.setAge(request.getAge());
                if (request.getGender()!=null) bio.setGender(request.getGender());
                if (request.getCity()!=null) bio.setCity(request.getCity());
                if (request.getLanguages()!=null) bio.setLanguages(request.getLanguages());
                if (request.getInterests()!=null) bio.setInterests(request.getInterests());
                if (request.getGenderPreference() != null) bio.setGenderPreference(request.getGenderPreference());
                if (request.getMinAgePreference() != null) bio.setMinAgePreference(request.getMinAgePreference());
                if (request.getMaxAgePreference() != null) bio.setMaxAgePreference(request.getMaxAgePreference());

                userBioRepository.save(bio);

                return profile;
        }

        //get particular user by id for recommendation endpoint
        public UserResponse getUserById(Long id) {
                User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                UserProfile profile = userProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

                return UserResponse.builder()
                        .id(user.getId())
                        .name(profile.getName())
                        .profileLink("/api/users/" + user.getId())
                        .profilePictureUrl(profile.getProfilePictureUrl())
                        .profileComplete(user.isProfileComplete())
                        .build();
        }

        //get user profile by id
        public UserProfileResponse getProfileById(Long id) {
                User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                UserProfile profile = userProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

                return UserProfileResponse.builder()
                        .id(user.getId())
                        .aboutMe(profile.getAboutMe())
                        .build();

        }

        //for Bio endpoint
        public UserBioResponse getBio(Long id){
                User user = userRepository.findById(id)
                        .orElseThrow(()->new ResourceNotFoundException("User not found"));

                UserBio bio = userBioRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Bio not found"));
                
                return UserBioResponse.builder()
                        .id(user.getId())
                        .age(bio.getAge())
                        .gender(bio.getGender())
                        .city(bio.getCity())
                        .interests(bio.getInterests())
                        .languages(bio.getLanguages())
                        .genderPreference(bio.getGenderPreference())
                        .minAgePreference(bio.getMinAgePreference())
                        .maxAgePreference(bio.getMaxAgePreference())
                        .build();

        }

        //for admin dashboard later
        public List<UserResponse> getAllUsers() {
                //return all the userProfiles in the repository
                return userProfileRepository.findAll().stream()
                .map(profile -> UserResponse.builder()
                        .id(profile.getUser().getId())
                        .name(profile.getName())
                        .profileLink("/api/users/" + profile.getUser().getId())
                        .build())
                .collect(Collectors.toList());
        }
}
