package com.assettrack.backend.service;

import com.assettrack.backend.domain.Role;
import com.assettrack.backend.domain.User;
import com.assettrack.backend.dto.auth.AuthResponse;
import com.assettrack.backend.dto.auth.LoginRequest;
import com.assettrack.backend.dto.auth.SignupRequest;
import com.assettrack.backend.exception.AuthenticationFailedException;
import com.assettrack.backend.exception.ConflictException;
import com.assettrack.backend.exception.ResourceNotFoundException;
import com.assettrack.backend.repository.UserRepository;
import com.assettrack.backend.security.JwtService;
import com.assettrack.backend.security.CustomUserDetailsService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            CustomUserDetailsService userDetailsService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    // ======================================================
    // SIGNUP
    // ======================================================
    public AuthResponse signup(SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
                        throw new ConflictException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        userRepository.save(user);

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(user.getEmail());

        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    // ======================================================
    // LOGIN
    // ======================================================
    public AuthResponse login(LoginRequest request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            System.err.println("Authentication failed for user: " + request.getEmail());
            System.err.println("Reason: " + e.getMessage());
            throw new AuthenticationFailedException("Login failed: " + e.getMessage());
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthenticationFailedException("Invalid email or password"));

        System.out.println("Login Debug - User: " + user.getEmail() + ", Found Role: " + user.getRole() + ", Requested Role: " + request.getRole());

        Role userRole = user.getRole();
        if (userRole == null) {
            // If role is null in DB, and they requested DEVELOPER, let them in (or handle as needed)
            if (request.getRole() != Role.DEVELOPER) {
                throw new AuthenticationFailedException("User has no role assigned. Please contact admin.");
            }
        } else if (!userRole.equals(request.getRole())) {
            throw new AuthenticationFailedException("Selected role does not match user account role");
        }

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(user.getEmail());

        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
