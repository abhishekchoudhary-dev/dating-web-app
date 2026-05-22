package com.matchme.backend.user.profile.dto;

import lombok.Data;
import java.util.List;
import jakarta.validation.constraints.*;
import com.matchme.backend.user.profile.Interest;
import com.matchme.backend.user.profile.Language;
import com.matchme.backend.user.profile.Gender;
import com.matchme.backend.user.profile.GenderPreference;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UserProfileRequest {
    @NotBlank(message = "Name is required")
    @Size(min=1,max=50, message = "Name must be between 2 and 50 characters")
    private String name;

    //holds the profile picture
    private MultipartFile profilePicture;

    @NotNull(message = "Age is required")
    @Min(value = 18,message="You must be at least 18 years old")
    @Max(value=100, message="Age must be realistic")
    private Integer age;

    private Integer minAgePreference;
    private Integer maxAgePreference;

    @NotNull
    private Gender gender;

    private GenderPreference genderPreference;

    @NotBlank(message = "City is required")
    private String city;

    @NotNull(message = "At least 1 language is required")
    @Size(min=1,max=3,message = "You can select between 1 and 3 langugages")
    private List<Language> languages;

    @NotNull(message = "At least 1 interest is required")
    @Size(min=1,max=5, message="You can select between 1 and 5 interests")
    private List<Interest> interests;
}


