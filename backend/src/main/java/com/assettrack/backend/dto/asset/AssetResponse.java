package com.assettrack.backend.dto.asset;

import com.assettrack.backend.domain.AssetStatus;
import com.assettrack.backend.domain.AssetType;
import com.assettrack.backend.dto.user.UserSummary;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AssetResponse {
    private Long id;
    private String serialNumber;
    private String brand;
    private String model;
    private AssetType type;
    private AssetStatus status;
    private LocalDate purchaseDate;
    private LocalDate warrantyExpirationDate;
    private LocalDateTime createdAt;
    private UserSummary assignedTo;
}
