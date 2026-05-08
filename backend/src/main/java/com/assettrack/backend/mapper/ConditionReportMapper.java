package com.assettrack.backend.mapper;

import com.assettrack.backend.domain.ConditionReport;
import com.assettrack.backend.dto.report.CreateConditionReportRequest;
import com.assettrack.backend.dto.report.ConditionReportResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {AssetMapper.class, UserMapper.class})
public interface ConditionReportMapper {

    @Mapping(target = "id",         ignore = true)
    @Mapping(target = "asset",      ignore = true)
    @Mapping(target = "reportedBy", ignore = true)
    @Mapping(target = "status",     ignore = true)
    @Mapping(target = "createdAt",  ignore = true)
    @Mapping(target = "resolvedAt", ignore = true)
    ConditionReport toEntity(CreateConditionReportRequest request);

    @Mapping(source = "asset",      target = "asset")
    @Mapping(source = "reportedBy", target = "reportedBy")
    ConditionReportResponse toResponse(ConditionReport report);
}
