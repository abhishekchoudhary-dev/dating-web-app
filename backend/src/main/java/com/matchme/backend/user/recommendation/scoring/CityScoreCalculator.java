package com.matchme.backend.user.recommendation.scoring;

import org.springframework.stereotype.Component;

@Component
public class CityScoreCalculator{
    private static final int SAME_CITY_POINTS = 15;
    public int calculate(String userCity, String candidateCity){
        if (userCity == null || candidateCity == null){
            return 0;
        }
        
        if (userCity == null || candidateCity == null) return 0;
        return userCity.equalsIgnoreCase(candidateCity) ? SAME_CITY_POINTS : 0;
        //need to add more city matching logic here
    }
}