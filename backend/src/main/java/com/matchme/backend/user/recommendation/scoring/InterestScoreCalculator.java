package com.matchme.backend.user.recommendation.scoring;

import org.springframework.stereotype.Component;
import com.matchme.backend.user.bio.enums.Interest;
import java.util.List;

@Component
public class InterestScoreCalculator{
    private static final int POINTS_PER_SHARED_INTEREST = 10;
    public int calculate(List<Interest> userInterests, List<Interest> candidateInterests){
        if (userInterests == null || candidateInterests == null){
            return 0;
        }
        //else we calculate score
        long sharedInterestsCount = userInterests.stream()
            .filter(candidateInterests::contains)
            .count();
        return (int) (sharedInterestsCount * POINTS_PER_SHARED_INTEREST);
    }
}

