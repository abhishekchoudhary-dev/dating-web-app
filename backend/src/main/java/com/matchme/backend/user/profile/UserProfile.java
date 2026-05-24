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

    @Column(name = "about_me")
    private String aboutMe;

}
