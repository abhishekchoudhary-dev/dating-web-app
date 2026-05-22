package com.matchme.backend.user.profile;


import com.matchme.backend.user.User;
import jakarta.validation.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="user_profiles")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JsonIgnore
    @OneToOne
    @JoinColumn(name="user_id", nullable=false, unique = true)
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(name="profile_picture_url")
    private String profilePictureUrl;

    @Column(nullable = false)
    private Integer age;

    //set age range for recommendations
    private Integer minAgePreference;
    private Integer maxAgePreference;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Column(nullable = false)
    private String city;

    //holds the preferred gender a user is trying to match with
    @Enumerated(EnumType.STRING)
    @Column(name="gender_preference")
    private GenderPreference genderPreference;

    @ElementCollection
    @CollectionTable
    (   name="user_profile_interests",
        joinColumns = @JoinColumn(name="profile_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name="interest")
    private List<Interest> interests;


    @ElementCollection
    @CollectionTable
    (
        name="user_profile_languages",
        joinColumns = @JoinColumn(name = "profile_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "language")
    private List<Language> languages;

}
