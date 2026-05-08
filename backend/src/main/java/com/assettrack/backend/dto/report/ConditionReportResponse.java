package com.assettrack.backend.dto.report;

import com.assettrack.backend.domain.ReportStatus;
import com.assettrack.backend.dto.asset.AssetSummary;
import com.assettrack.backend.dto.user.UserSummary;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ConditionReportResponse {
    private Long id;
    private AssetSummary asset;
    private UserSummary reportedBy;
    private String issueTitle;
    private String description;
    private ReportStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
