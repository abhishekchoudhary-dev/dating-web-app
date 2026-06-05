package com.matchme.backend.user.recommendation.scoring;

import org.springframework.stereotype.Component;

@Component
public class LocationScoreCalculator {
    private static final int SAME_CITY_POINTS = 15;
    public int calculate(String userLocation, String candidateLocation){
        if (userLocation == null || candidateLocation == null) return 0;

        return userLocation.equalsIgnoreCase(candidateLocation) ? SAME_CITY_POINTS : 0;
        //need to add more city matching logic here
    }
}