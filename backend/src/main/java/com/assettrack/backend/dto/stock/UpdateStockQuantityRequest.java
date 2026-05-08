package com.assettrack.backend.dto.stock;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UpdateStockQuantityRequest {
    @NotNull @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;
}
