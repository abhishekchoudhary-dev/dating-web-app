package com.matchme.backend.user.recommendation;

import com.matchme.backend.exception.ResourceNotFoundException;
import com.matchme.backend.user.User;
import com.matchme.backend.user.UserRepository;
import com.matchme.backend.user.profile.GenderPreference;
import com.matchme.backend.user.profile.UserBio;
import com.matchme.backend.user.profile.UserBioRepository;
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

    private final ScoreCalculator scoreCalculator;
    private final UserBioRepository userBioRepository;

    private static final int MAX_RECOMMENDATIONS = 10;

    public List<RecommendationResponse> getRecommendations(User currentUser) {

        UserBio currentBio = userBioRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Complete your bio first"));

        // Get all profiles except current user
        List<UserBio> candidates = userBioRepository.findAll().stream()
                .filter(b -> !b.getUser().getId().equals(currentUser.getId()))
                .collect(Collectors.toList());

        return candidates.stream()
                // Filter 1 — gender preference
                .filter(b -> matchesGenderPreference(currentBio, b))
                // Filter 2 — age range preference
                .filter(b -> matchesAgePreference(currentBio, b))
                // Score each candidate
                .map(b -> new ScoredBio(b, scoreCalculator.calculate(currentBio, b)))
                // Only include candidates with score > 0
                .filter(sb -> sb.score > 0)
                // Sort by score descending
                .sorted(Comparator.comparingInt(ScoredBio::getScore).reversed())
                // Take max 10
                .limit(MAX_RECOMMENDATIONS)
                // Map to response
                .map(sb-> RecommendationResponse.builder()
                        .id(sb.bio.getUser().getId())
                        .build())
                .collect(Collectors.toList());
    }

    private boolean matchesGenderPreference(UserBio current, UserBio candidate) {
        if (current.getGenderPreference() == null) return true;
        if (current.getGenderPreference() == GenderPreference.ANY) return true;
        if (candidate.getGender() == null) return false;
        return candidate.getGender().name().equals(current.getGenderPreference().name());
    }

    private boolean matchesAgePreference(UserBio current, UserBio candidate) {
        if (current.getMinAgePreference() == null && current.getMaxAgePreference() == null) return true;
        if (candidate.getAge() == null) return false;
        if (current.getMinAgePreference() != null && candidate.getAge() < current.getMinAgePreference()) return false;
        if (current.getMaxAgePreference() != null && candidate.getAge() > current.getMaxAgePreference()) return false;
        return true;
    }

    // Inner class to hold profile and score together
    private static class ScoredBio {
        UserBio bio;
        int score;

        ScoredBio(UserBio bio, int score) {
            this.bio = bio;
            this.score = score;
        }

        int getScore() {
            return score;
        }
    }
}