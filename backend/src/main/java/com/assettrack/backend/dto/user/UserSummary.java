package com.assettrack.backend.dto.user;

import com.assettrack.backend.domain.Role;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserSummary {
    private Long id;
    private String name;
    private String email;
    private Role role;
}
