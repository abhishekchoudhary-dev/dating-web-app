package com.matchme.backend.profile;

import com.matchme.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface UserProfileRepository extends JpaRepository<UserProfile,Long>{
    Optional<UserProfile> findByUser(User user);
    @Query("""
        SELECT p FROM UserProfile p
        JOIN p.interests i
        WHERE i IN :interests
        AND p.id != :excludeId
        GROUP BY p.id
        ORDER BY COUNT(i) DESC
        """)
    List<UserProfile> findMatchByInterests(
        @Param("interests") List<Interest> interests,
        @Param("excludeId") Long excludeId
    );
}
