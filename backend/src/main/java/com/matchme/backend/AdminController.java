package com.matchme.backend;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    @PersistenceContext
    private EntityManager entityManager;

    private final DataSeeder dataSeeder;

    @Transactional
    @DeleteMapping("/clear")
    public ResponseEntity<String> clearDatabase() {
        log.info("Admin: clearing database");
        entityManager.createNativeQuery("DELETE FROM messages").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM connections").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM user_bio_interests").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM user_bio_languages").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM bios").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM user_profiles").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM users").executeUpdate();
        log.info("Admin: database cleared");
        return ResponseEntity.ok("Database cleared");
    }

    @Transactional
    @PostMapping("/reseed")
    public ResponseEntity<String> reseedDatabase() {
        log.info("Admin: reseeding database");
        entityManager.createNativeQuery("DELETE FROM messages").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM connections").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM user_bio_interests").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM user_bio_languages").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM bios").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM user_profiles").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM users").executeUpdate();
        dataSeeder.seedUsers();
        log.info("Admin: reseeding complete");
        return ResponseEntity.ok("Database reseeded with 100 users");
    }
}