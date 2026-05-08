package com.assettrack.backend.dto.asset;

import com.assettrack.backend.domain.AssetType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CreateAssetRequest {
    @NotBlank(message = "Serial number is required")
    private String serialNumber;

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Model is required")
    private String model;

    @NotNull(message = "Asset type is required")
    private AssetType type;

    @NotNull(message = "Purchase date is required")
    private LocalDate purchaseDate;

    @NotNull(message = "Warranty expiration date is required")
    private LocalDate warrantyExpirationDate;
}
