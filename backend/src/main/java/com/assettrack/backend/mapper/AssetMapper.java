package com.assettrack.backend.mapper;

import com.assettrack.backend.domain.Asset;
import com.assettrack.backend.dto.asset.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AssetMapper {

    @Mapping(target = "id",        ignore = true)
    @Mapping(target = "status",    ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Asset toEntity(CreateAssetRequest request);

    @Mapping(target = "assignedTo", ignore = true)
    AssetResponse toResponse(Asset asset);

    AssetSummary toSummary(Asset asset);

    @Mapping(target = "id",           ignore = true)
    @Mapping(target = "serialNumber", ignore = true)
    @Mapping(target = "type",         ignore = true)
    @Mapping(target = "purchaseDate", ignore = true)
    @Mapping(target = "createdAt",    ignore = true)
    void updateEntity(UpdateAssetRequest request, @MappingTarget Asset asset);
}