package com.assettrack.backend.dto.dashboard;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserAssetCount {
    private Long userId;
    private String userName;
    private int assetCount;
}
