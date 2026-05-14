package com.matchme.backend.profile.dto;

import lombok.Data;
import java.util.List;
import com.matchme.backend.profile.Interest;
import com.matchme.backend.profile.Language;

@Data
public class UserProfileRequest {
    private String name;
    private Integer age;
    private String gender;
    private String city;
    private List<Language> languages;
    private List<Interest> interests;
}


