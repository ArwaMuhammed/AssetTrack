package com.assettrack.backend.controller;

import com.assettrack.backend.domain.ReportStatus;
import com.assettrack.backend.dto.report.ConditionReportResponse;
import com.assettrack.backend.dto.report.CreateConditionReportRequest;
import com.assettrack.backend.dto.report.UpdateReportStatusRequest;
import com.assettrack.backend.security.CustomUserDetailsService;
import com.assettrack.backend.service.ConditionReportService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ConditionReportController {

    private final ConditionReportService reportService;
    private final CustomUserDetailsService userDetailsService;

    public ConditionReportController(ConditionReportService reportService,
                                     CustomUserDetailsService userDetailsService) {
        this.reportService = reportService;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER')")
    public ResponseEntity<ConditionReportResponse> createReport(@Valid @RequestBody CreateConditionReportRequest request,
                                                                @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userDetailsService.getUserIdByEmail(userDetails.getUsername());
        return ResponseEntity.ok(reportService.createReport(request, userId));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ConditionReportResponse> updateStatus(@PathVariable Long id,
                                                                @Valid @RequestBody UpdateReportStatusRequest request) {
        return ResponseEntity.ok(reportService.updateStatus(id, request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<ConditionReportResponse>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("/asset/{assetId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<ConditionReportResponse>> getByAsset(@PathVariable Long assetId) {
        return ResponseEntity.ok(reportService.getReportsByAsset(assetId));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<ConditionReportResponse>> getByStatus(@PathVariable ReportStatus status) {
        return ResponseEntity.ok(reportService.getReportsByStatus(status));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER')")
    public ResponseEntity<List<ConditionReportResponse>> getMyReports(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userDetailsService.getUserIdByEmail(userDetails.getUsername());
        return ResponseEntity.ok(reportService.getMyReports(userId));
    }
}