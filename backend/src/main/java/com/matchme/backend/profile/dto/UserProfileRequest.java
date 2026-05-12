package com.matchme.backend.profile.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserProfileRequest {
    private String name;
    private int age;
    private String gender;
    private String city;
    private List<String> languages;
    private List<Long> interestIds;
}


