package com.matchme.backend.user.recommendation;

import com.matchme.backend.exception.ResourceNotFoundException;
import com.matchme.backend.user.User;
import com.matchme.backend.user.UserRepository;
import com.matchme.backend.user.profile.GenderPreference;
import com.matchme.backend.user.profile.UserProfile;
import com.matchme.backend.user.profile.UserProfileRepository;
import com.matchme.backend.user.recommendation.dto.RecommendationResponse;
import com.matchme.backend.user.recommendation.scoring.ScoreCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class RecommendationService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;
    private final ScoreCalculator scoreCalculator;

    private static final int MAX_RECOMMENDATIONS = 10;

    public List<RecommendationResponse> getRecommendations(User currentUser) {

        UserProfile currentProfile = userProfileRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Complete your profile first"));

        // Get all profiles except current user
        List<UserProfile> candidates = userProfileRepository.findAll().stream()
                .filter(p -> !p.getUser().getId().equals(currentUser.getId()))
                .collect(Collectors.toList());

        return candidates.stream()
                // Filter 1 — gender preference
                .filter(p -> matchesGenderPreference(currentProfile, p))
                // Filter 2 — age range preference
                .filter(p -> matchesAgePreference(currentProfile, p))
                // Score each candidate
                .map(p -> new ScoredProfile(p, scoreCalculator.calculate(currentProfile, p)))
                // Only include candidates with score > 0
                .filter(sp -> sp.score > 0)
                // Sort by score descending
                .sorted(Comparator.comparingInt(ScoredProfile::getScore).reversed())
                // Take max 10
                .limit(MAX_RECOMMENDATIONS)
                // Map to response
                .map(sp -> RecommendationResponse.builder()
                        .id(sp.profile.getUser().getId())
                        .build())
                .collect(Collectors.toList());
    }

    private boolean matchesGenderPreference(UserProfile current, UserProfile candidate) {
        if (current.getGenderPreference() == null) return true;
        if (current.getGenderPreference() == GenderPreference.ANY) return true;
        if (candidate.getGender() == null) return false;
        return candidate.getGender().name().equals(current.getGenderPreference().name());
    }

    private boolean matchesAgePreference(UserProfile current, UserProfile candidate) {
        if (current.getMinAgePreference() == null && current.getMaxAgePreference() == null) return true;
        if (candidate.getAge() == null) return false;
        if (current.getMinAgePreference() != null && candidate.getAge() < current.getMinAgePreference()) return false;
        if (current.getMaxAgePreference() != null && candidate.getAge() > current.getMaxAgePreference()) return false;
        return true;
    }

    // Inner class to hold profile and score together
    private static class ScoredProfile {
        UserProfile profile;
        int score;

        ScoredProfile(UserProfile profile, int score) {
            this.profile = profile;
            this.score = score;
        }

        int getScore() {
            return score;
        }
    }
}