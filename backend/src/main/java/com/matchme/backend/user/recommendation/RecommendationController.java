package com.matchme.backend.user.recommendation;

import com.matchme.backend.user.User;
import com.matchme.backend.user.recommendation.dto.RecommendationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/recommendations")
    public ResponseEntity<List<RecommendationResponse>> getRecommendations(
            @AuthenticationPrincipal User user) {
        List<RecommendationResponse> recommendations = recommendationService.getRecommendations(user);
        return ResponseEntity.ok(recommendations);
    }
}