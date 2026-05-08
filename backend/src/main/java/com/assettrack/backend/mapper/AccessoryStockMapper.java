package com.assettrack.backend.mapper;

import com.assettrack.backend.domain.AccessoryStock;
import com.assettrack.backend.dto.stock.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AccessoryStockMapper {

    @Mapping(target = "id",        ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    AccessoryStock toEntity(CreateAccessoryStockRequest request);

    @Mapping(target = "lowStock",
             expression = "java(stock.getQuantity() < stock.getMinimumRequiredQuantity())")
    AccessoryStockResponse toResponse(AccessoryStock stock);

    @Mapping(target = "id",                      ignore = true)
    @Mapping(target = "name",                    ignore = true)
    @Mapping(target = "minimumRequiredQuantity", ignore = true)
    @Mapping(target = "updatedAt",               ignore = true)
    void updateQuantity(UpdateStockQuantityRequest request, @MappingTarget AccessoryStock stock);
}
