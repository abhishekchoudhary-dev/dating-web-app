package com.matchme.backend.user.profile.dto;

import lombok.*;
import com.matchme.backend.user.profile.Interest;
import com.matchme.backend.user.profile.Language;
import java.util.List;

@Data
@Builder
public class BioResponse{
    private Long id;
    private Integer age;
    private String gender;
    private String city;
    private List<Interest> interests;
    private List<Language> languages;
}