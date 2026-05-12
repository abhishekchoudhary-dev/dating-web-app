package com.matchme.backend.profile;

import lombok.*;
import jakarta.persistence.*;
import java.util.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="interests")
public class Interest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable= false)
    private String name;

    @ManyToMany(mappedBy = "interests")
    private List<UserProfile> profiles;

}
