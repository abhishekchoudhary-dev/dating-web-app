package com.matchme.backend.user.profile;

import com.matchme.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface UserProfileRepository extends JpaRepository<UserProfile,Long>{
    Optional<UserProfile> findByUser(User user);
}
