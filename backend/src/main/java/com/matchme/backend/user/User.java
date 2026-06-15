package com.matchme.backend.user;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.Instant;
import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Authentication
    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    // Data
    private String name;
    private String profileLink;
    private String profilePictureLink;

    //chat
    private Instant lastSeenAt;

    // UserDetails
    @NonNull
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @NonNull
    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public boolean isComplete() {
        return name != null;
    }
}