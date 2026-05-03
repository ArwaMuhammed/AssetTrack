package com.assettrack.backend.repository;

import com.assettrack.backend.domain.Asset;
import com.assettrack.backend.domain.ConditionReport;
import com.assettrack.backend.domain.ReportStatus;
import com.assettrack.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConditionReportRepository extends JpaRepository<ConditionReport, Long> {

    List<ConditionReport> findByAsset(Asset asset);

    List<ConditionReport> findByReportedBy(User reportedBy);

    List<ConditionReport> findByStatus(ReportStatus status);
}