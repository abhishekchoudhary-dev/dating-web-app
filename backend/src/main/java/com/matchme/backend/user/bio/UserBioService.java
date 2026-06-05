package com.matchme.backend.user.bio;

import com.matchme.backend.exception.ResourceNotFoundException;
import com.matchme.backend.user.User;
import com.matchme.backend.user.bio.dto.UserBioResponse;
import com.matchme.backend.user.bio.enums.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserBioService {
    private final UserBioRepository userBioRepository;
    private final UserBioMapper userBioMapper;

    @Transactional
    public void createEmpty(User user) {
        userBioRepository.save(new UserBio(user));
    }

    public UserBioResponse get(Long userId) {
        UserBio bio = userBioRepository.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("user bio not found for id: " + userId));
        return userBioMapper.toResponse(bio);
    }

    public Map<String, List<? extends UserBioOption>> getOptions() {
        return Map.of(
                "genders", List.of(Gender.values()),
                "languages", List.of(Language.values()),
                "interests", List.of(Interest.values()),
                "genderPreferences", List.of(GenderPreference.values())
        );
    }
}