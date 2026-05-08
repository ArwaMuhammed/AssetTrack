package com.assettrack.backend.dto.allocation;

import com.assettrack.backend.dto.asset.AssetSummary;
import com.assettrack.backend.dto.user.UserSummary;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AllocationResponse {
    private Long id;
    private AssetSummary asset;
    private UserSummary user;
    private LocalDateTime assignedAt;
    private LocalDateTime returnedAt;
}
