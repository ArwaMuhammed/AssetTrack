package com.assettrack.backend.dto.user;

import com.assettrack.backend.domain.Role;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UpdateUserRoleRequest {
    @NotNull(message = "Role is required")
    private Role role;
}
