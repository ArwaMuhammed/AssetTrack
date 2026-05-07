package com.assettrack.backend.controller;

import com.assettrack.backend.dto.AuthResponse;
import com.assettrack.backend.dto.LoginRequest;
import com.assettrack.backend.dto.SignupRequest;
import com.assettrack.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * POST /api/auth/signup
     * Public — no token required.
     * Body: { "name": "Alice", "email": "alice@test.com", "password": "123456", "role": "DEVELOPER" }
     */
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest request) {
        AuthResponse response = authService.signup(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/login
     * Public — no token required.
     * Body: { "email": "alice@test.com", "password": "123456" }
     * Returns: { "token": "eyJ...", "email": "alice@test.com", "role": "DEVELOPER" }
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}