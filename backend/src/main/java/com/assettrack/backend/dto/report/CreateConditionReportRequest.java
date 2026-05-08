package com.assettrack.backend.dto.report;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CreateConditionReportRequest {
    @NotNull(message = "Asset ID is required")
    private Long assetId;

    @NotBlank(message = "Issue title is required")
    private String issueTitle;

    @NotBlank(message = "Description is required")
    private String description;
}
