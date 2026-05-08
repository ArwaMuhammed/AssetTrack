package com.assettrack.backend.dto.report;

import com.assettrack.backend.domain.ReportStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UpdateReportStatusRequest {
    @NotNull(message = "Status is required")
    private ReportStatus status;
}
