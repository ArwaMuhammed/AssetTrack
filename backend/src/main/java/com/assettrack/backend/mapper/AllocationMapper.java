package com.assettrack.backend.mapper;

import com.assettrack.backend.domain.AssetAllocation;
import com.assettrack.backend.dto.allocation.AllocationResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {AssetMapper.class, UserMapper.class})
public interface AllocationMapper {

    @Mapping(source = "asset", target = "asset")
    @Mapping(source = "user",  target = "user")
    AllocationResponse toResponse(AssetAllocation allocation);
}
