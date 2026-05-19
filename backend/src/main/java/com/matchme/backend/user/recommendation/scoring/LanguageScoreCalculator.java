package com.matchme.backend.user.recommendation.scoring;

import org.springframework.stereotype.Component;
import com.matchme.backend.user.profile.Language;
import java.util.*;

@Component
public class LanguageScoreCalculator{
    private static final int POINTS_PER_SHARED_LANGUAGE = 5;
    public int calculate(List<Language> userLanguages, List<Language> candidateLanguages){
        if (userLanguages == null || candidateLanguages == null){
            return 0;
        }
        //else we calculate score
        long sharedLanguagesCount = userLanguages.stream()
            .filter(candidateLanguages::contains)
            .count();
        return (int) (sharedLanguagesCount * POINTS_PER_SHARED_LANGUAGE);
    }
}