package com.assettrack.backend.dto.stock;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CreateAccessoryStockRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotNull @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @NotNull @Min(value = 1, message = "Minimum required quantity must be at least 1")
    private Integer minimumRequiredQuantity;
}
