package com.matchme.backend.user.bio;

import com.matchme.backend.user.User;
import com.matchme.backend.user.bio.enums.Gender;
import com.matchme.backend.user.bio.enums.GenderPreference;
import com.matchme.backend.user.bio.enums.Interest;
import com.matchme.backend.user.bio.enums.Language;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bios")
public class UserBio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name="user_id", nullable=false, unique = true)
    private User user;

    private Integer age;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String location;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_bio_interests",
            joinColumns = @JoinColumn(name = "bio_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "interest")
    private List<Interest> interests;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_bio_languages",
            joinColumns = @JoinColumn(name = "bio_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "language")
    private List<Language> languages;

    // Preferences
    private Integer preferenceAgeMin;
    private Integer preferenceAgeMax;
    private Integer preferenceDistanceRadius;
    private GenderPreference preferenceGender;

    public UserBio(User user) {
        this.user = user;
    }

    public boolean isComplete() {
        return age != null
            && gender != null
            && location != null
            && interests != null && !interests.isEmpty()
            && languages != null && !languages.isEmpty()
            && preferenceAgeMin != null
            && preferenceAgeMax != null
            && preferenceDistanceRadius != null
            && preferenceGender != null;
    }
}