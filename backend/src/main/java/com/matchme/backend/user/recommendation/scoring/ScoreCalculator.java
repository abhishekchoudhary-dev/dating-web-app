package com.matchme.backend.user.recommendation.scoring;

import lombok.*;
import org.springframework.stereotype.Component;
import com.matchme.backend.user.bio.UserBio;

@Component
@RequiredArgsConstructor
public class ScoreCalculator{
    private final InterestScoreCalculator interestScoreCalculator;
    private final LanguageScoreCalculator languageScoreCalculator;
    //TODO 
    //private final LocationScoreCalculator cityScoreCalculator;

    public int calculate(UserBio currentUser, UserBio candidate){
        int score = 0;

        score += interestScoreCalculator.calculate
        (currentUser.getInterests(),candidate.getInterests()
        );

        score += languageScoreCalculator.calculate
        (currentUser.getLanguages(),candidate.getLanguages()
        );
        //score += cityScoreCalculator.calculate
        //(currentUser.getLocation(),candidate.getLocation()
        //);

        return score;

    }
}