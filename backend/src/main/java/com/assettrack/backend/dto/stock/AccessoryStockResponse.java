package com.assettrack.backend.dto.stock;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AccessoryStockResponse {
    private Long id;
    private String name;
    private Integer quantity;
    private Integer minimumRequiredQuantity;
    private boolean lowStock;
    private LocalDateTime updatedAt;
}
