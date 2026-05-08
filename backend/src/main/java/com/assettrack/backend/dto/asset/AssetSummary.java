package com.assettrack.backend.dto.asset;

import com.assettrack.backend.domain.AssetStatus;
import com.assettrack.backend.domain.AssetType;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AssetSummary {
    private Long id;
    private String serialNumber;
    private String brand;
    private String model;
    private AssetType type;
    private AssetStatus status;
}
