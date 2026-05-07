package com.assettrack.backend.dto;

import com.assettrack.backend.domain.Role;
import lombok.Data;

@Data
public class SignupRequest {
    private String name;
    private String email;
    private String password;
    private Role role; // ADMIN, MANAGER, or DEVELOPER
}