package com.matchme.backend.user.recommendation;

import com.matchme.backend.exception.ResourceNotFoundException;
import com.matchme.backend.user.User;
import com.matchme.backend.user.UserRepository;
import com.matchme.backend.user.bio.enums.GenderPreference;
import com.matchme.backend.user.connection.ConnectionRepository;
import com.matchme.backend.user.connection.ConnectionService;   
import com.matchme.backend.user.bio.UserBio;
import com.matchme.backend.user.bio.UserBioRepository;
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
    private final ConnectionService connectionService;

    private static final int MAX_RECOMMENDATIONS = 10;

    public List<Long> getRecommendations(User currentUser) {

        // TODO use isProfileComplete instead
        UserBio currentBio = userBioRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Complete your bio first"));


        // Get excluded user IDs
        List<Long> excludedIds = connectionService.getExcludedUserIds(currentUser);

        // Get all profiles except current user
        //List<UserBio> candidates = userBioRepository.findAll().stream()
        //        .filter(b -> !b.getUser().getId().equals(currentUser.getId()))
        //        .toList();
        //get all profiles expect current user and excluded user based on criteria
        List<UserBio> candidates = userBioRepository.findAll().stream()
            .filter(b -> !b.getUser().getId().equals(currentUser.getId()))
            .filter(b -> !excludedIds.contains(b.getUser().getId()))
            .toList();

        return candidates.stream()
                // Filter 1 — gender preference
                .filter(b -> matchesGenderPreference(currentBio, b))
                // Filter 2 — age range preference
                .filter(b -> matchesAgePreference(currentBio, b))
                // Location must match for basic build
                .filter(b -> matchesLocation(currentBio, b))  
                // Score each candidate
                .map(b -> new ScoredBio(b, scoreCalculator.calculate(currentBio, b)))
                // Only include candidates with score > 10 to exclude bad match
                .filter(sb -> sb.score > 10)
                // Sort by score descending
                .sorted(Comparator.comparingInt(ScoredBio::getScore).reversed())
                // Take max 10
                .limit(MAX_RECOMMENDATIONS)
                // Map to response
                .map(sb-> sb.bio.getUser().getId())        
                .collect(Collectors.toList());
    }

    private boolean matchesGenderPreference(UserBio current, UserBio candidate) {
        if (current.getPreferenceGender() == null) return true;
        if (current.getPreferenceGender() == GenderPreference.ANY) return true;
        if (candidate.getGender() == null) return false;
        return candidate.getGender().name().equals(current.getPreferenceGender().name());
    }

    private boolean matchesAgePreference(UserBio current, UserBio candidate) {
        if (current.getPreferenceAgeMin() == null && current.getPreferenceAgeMax() == null) return true;
        if (candidate.getAge() == null) return false;
        if (current.getPreferenceAgeMin() != null && candidate.getAge() < current.getPreferenceAgeMin()) return false;
        if (current.getPreferenceAgeMax() != null && candidate.getAge() > current.getPreferenceAgeMax()) return false;
        return true;
    }

    private boolean matchesLocation(UserBio current, UserBio candidate) {
    if (current.getLocation() == null || candidate.getLocation() == null) return true;
    return current.getLocation().equalsIgnoreCase(candidate.getLocation());
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