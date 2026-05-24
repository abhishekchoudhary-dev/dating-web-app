package com.matchme.backend.user.profile;

import com.matchme.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserBioRepository extends JpaRepository<UserBio, Long> {
    Optional<UserBio> findByUser(User user);
}