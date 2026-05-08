package com.assettrack.backend.service;

import com.assettrack.backend.domain.AssetStatus;
import com.assettrack.backend.domain.AssetType;
import com.assettrack.backend.domain.ReportStatus;
import com.assettrack.backend.dto.dashboard.DashboardResponse;
import com.assettrack.backend.repository.AssetRepository;
import com.assettrack.backend.repository.ConditionReportRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final AssetRepository assetRepository;
    private final ConditionReportRepository reportRepository;

    public DashboardService(AssetRepository assetRepository,
                            ConditionReportRepository reportRepository) {
        this.assetRepository = assetRepository;
        this.reportRepository = reportRepository;
    }

    public DashboardResponse getDashboard() {
        var allAssets = assetRepository.findAll();
        LocalDate in30Days = LocalDate.now().plusDays(30);

        long total = allAssets.size();
        long assigned = allAssets.stream().filter(a -> a.getStatus() == AssetStatus.ASSIGNED).count();
        long available = allAssets.stream().filter(a -> a.getStatus() == AssetStatus.AVAILABLE).count();
        long maintenance = allAssets.stream().filter(a -> a.getStatus() == AssetStatus.MAINTENANCE).count();
        long decommissioned = allAssets.stream().filter(a -> a.getStatus() == AssetStatus.DECOMMISSIONED).count();

        long expiringIn30Days = allAssets.stream()
                .filter(a -> a.getWarrantyExpirationDate() != null
                        && !a.getWarrantyExpirationDate().isAfter(in30Days)
                        && !a.getWarrantyExpirationDate().isBefore(LocalDate.now()))
                .count();

        long openReports = reportRepository.findByStatus(ReportStatus.OPEN).size();

        Map<String, Long> byType = Arrays.stream(AssetType.values())
                .collect(Collectors.toMap(
                        Enum::name,
                        type -> allAssets.stream().filter(a -> a.getType() == type).count()
                ));

        Map<String, Long> byStatus = Arrays.stream(AssetStatus.values())
                .collect(Collectors.toMap(
                        Enum::name,
                        status -> allAssets.stream().filter(a -> a.getStatus() == status).count()
                ));

        return DashboardResponse.builder()
                .totalAssets(total)
                .assignedAssets(assigned)
                .availableAssets(available)
                .maintenanceAssets(maintenance)
                .decommissionedAssets(decommissioned)
                .expiringWithin30Days(expiringIn30Days)
                .openConditionReports(openReports)
                .assetsByType(byType)
                .assetsByStatus(byStatus)
                .build();
    }
}