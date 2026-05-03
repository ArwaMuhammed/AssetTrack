package com.assettrack.backend.repository;

import com.assettrack.backend.domain.Asset;
import com.assettrack.backend.domain.AssetStatus;
import com.assettrack.backend.domain.AssetType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssetRepository extends JpaRepository<Asset, Long> {

    Optional<Asset> findBySerialNumber(String serialNumber);

    List<Asset> findByType(AssetType type);

    List<Asset> findByStatus(AssetStatus status);

    List<Asset> findByTypeAndStatus(AssetType type, AssetStatus status);

    List<Asset> findByBrandContainingIgnoreCase(String brand);

    List<Asset> findByModelContainingIgnoreCase(String model);
}