package com.assettrack.backend.repository;

import com.assettrack.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Used by CustomUserDetailsService to load user during login
    Optional<User> findByEmail(String email);

    // Used by AuthService to check if email is already taken during signup
    boolean existsByEmail(String email);
}