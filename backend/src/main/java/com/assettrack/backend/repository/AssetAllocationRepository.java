package com.assettrack.backend.repository;

import com.assettrack.backend.domain.Asset;
import com.assettrack.backend.domain.AssetAllocation;
import com.assettrack.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssetAllocationRepository extends JpaRepository<AssetAllocation, Long> {

    List<AssetAllocation> findByAsset(Asset asset);

    List<AssetAllocation> findByUser(User user);

    Optional<AssetAllocation> findByAssetAndReturnedAtIsNull(Asset asset);

    List<AssetAllocation> findByUserAndReturnedAtIsNull(User user);
}