package com.assettrack.backend.dto.allocation;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AllocateAssetRequest {
    @NotNull(message = "Asset ID is required")
    private Long assetId;

    @NotNull(message = "User ID is required")
    private Long userId;
}
