package com.matchme.backend.user.bio;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserBioRepository extends JpaRepository<UserBio, Long> {
    Optional<UserBio> findByUserId(Long id);
}