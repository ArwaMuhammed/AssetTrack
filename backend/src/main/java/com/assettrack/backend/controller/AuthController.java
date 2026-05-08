package com.assettrack.backend.controller;

import com.assettrack.backend.dto.auth.AuthResponse;
import com.assettrack.backend.dto.auth.LoginRequest;
import com.assettrack.backend.dto.auth.SignupRequest;
import com.assettrack.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ======================================================
    // SIGNUP
    // ======================================================
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(
            @Valid @RequestBody SignupRequest request
    ) {
        return ResponseEntity.ok(authService.signup(request));
    }

    // ======================================================
    // LOGIN
    // ======================================================
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(authService.login(request));
    }
}
