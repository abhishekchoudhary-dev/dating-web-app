package com.matchme.backend.user.profile;

import com.matchme.backend.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @OneToOne
    @JoinColumn(name="user_id", nullable=false, unique = true)
    private User user;

    @Column(name = "about_me", columnDefinition = "TEXT")
    private String aboutMe;

    // Constructor to create an empty profile
    public UserProfile(User user) {
        this.user = user;
    }

    public boolean isComplete() {
        return aboutMe != null;
    }
}