package com.assettrack.backend.service;

import com.assettrack.backend.domain.Asset;
import com.assettrack.backend.domain.ConditionReport;
import com.assettrack.backend.domain.ReportStatus;
import com.assettrack.backend.domain.User;
import com.assettrack.backend.dto.report.ConditionReportResponse;
import com.assettrack.backend.dto.report.CreateConditionReportRequest;
import com.assettrack.backend.dto.report.UpdateReportStatusRequest;
import com.assettrack.backend.exception.ResourceNotFoundException;
import com.assettrack.backend.mapper.ConditionReportMapper;
import com.assettrack.backend.repository.AssetRepository;
import com.assettrack.backend.repository.ConditionReportRepository;
import com.assettrack.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConditionReportService {

    private final ConditionReportRepository reportRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final ConditionReportMapper reportMapper;

    public ConditionReportService(ConditionReportRepository reportRepository,
                                  AssetRepository assetRepository,
                                  UserRepository userRepository,
                                  ConditionReportMapper reportMapper) {
        this.reportRepository = reportRepository;
        this.assetRepository = assetRepository;
        this.userRepository = userRepository;
        this.reportMapper = reportMapper;
    }

    public ConditionReportResponse createReport(CreateConditionReportRequest request, Long reporterUserId) {
        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        User reporter = userRepository.findById(reporterUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ConditionReport report = reportMapper.toEntity(request);
        report.setAsset(asset);
        report.setReportedBy(reporter);

        return reportMapper.toResponse(reportRepository.save(report));
    }

    public ConditionReportResponse updateStatus(Long reportId, UpdateReportStatusRequest request) {
        ConditionReport report = reportRepository.findById(reportId)
                                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        report.setStatus(request.getStatus());

        if (request.getStatus() == ReportStatus.RESOLVED) {
            report.setResolvedAt(LocalDateTime.now());
        }

        return reportMapper.toResponse(reportRepository.save(report));
    }

    public List<ConditionReportResponse> getAllReports() {
        return reportRepository.findAll()
                .stream()
                .map(reportMapper::toResponse)
                .toList();
    }

    public List<ConditionReportResponse> getReportsByAsset(Long assetId) {
        Asset asset = assetRepository.findById(assetId)
                                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        return reportRepository.findByAsset(asset)
                .stream()
                .map(reportMapper::toResponse)
                .toList();
    }

    public List<ConditionReportResponse> getReportsByStatus(ReportStatus status) {
        return reportRepository.findByStatus(status)
                .stream()
                .map(reportMapper::toResponse)
                .toList();
    }

    public List<ConditionReportResponse> getMyReports(Long userId) {
        User user = userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return reportRepository.findByReportedBy(user)
                .stream()
                .map(reportMapper::toResponse)
                .toList();
    }
}