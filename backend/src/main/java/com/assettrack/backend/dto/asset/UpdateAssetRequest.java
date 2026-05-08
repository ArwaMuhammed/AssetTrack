package com.assettrack.backend.dto.asset;

import com.assettrack.backend.domain.AssetStatus;
import lombok.*;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UpdateAssetRequest {
    private String brand;
    private String model;
    private AssetStatus status;
    private LocalDate warrantyExpirationDate;
}
