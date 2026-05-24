package com.matchme.backend.user.profile;

import com.matchme.backend.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_bios")
public class UserBio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private Integer age;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Column(nullable = false)
    private String city;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender_preference")
    private GenderPreference genderPreference;

    private Integer minAgePreference;
    private Integer maxAgePreference;

    @ElementCollection
    @CollectionTable(
        name = "user_bio_interests",
        joinColumns = @JoinColumn(name = "bio_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "interest")
    private List<Interest> interests;

    @ElementCollection
    @CollectionTable(
        name = "user_bio_languages",
        joinColumns = @JoinColumn(name = "bio_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "language")
    private List<Language> languages;
}