package com.assettrack.backend.dto.dashboard;

import lombok.*;
import java.util.Map;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardResponse {
    private long totalAssets;
    private long assignedAssets;
    private long availableAssets;
    private long maintenanceAssets;
    private long decommissionedAssets;
    private long expiringWithin30Days;
    private long openConditionReports;
    private Map<String, Long> assetsByType;
    private Map<String, Long> assetsByStatus;
}
