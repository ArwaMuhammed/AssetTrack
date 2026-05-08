package com.assettrack.backend.service;

import com.assettrack.backend.domain.Asset;
import com.assettrack.backend.domain.AssetStatus;
import com.assettrack.backend.domain.AssetType;
import com.assettrack.backend.dto.asset.AssetResponse;
import com.assettrack.backend.dto.asset.AssetSummary;
import com.assettrack.backend.dto.asset.CreateAssetRequest;
import com.assettrack.backend.dto.asset.UpdateAssetRequest;
import com.assettrack.backend.dto.user.UserSummary;
import com.assettrack.backend.exception.ConflictException;
import com.assettrack.backend.exception.ResourceNotFoundException;
import com.assettrack.backend.mapper.AssetMapper;
import com.assettrack.backend.mapper.UserMapper;
import com.assettrack.backend.repository.AssetAllocationRepository;
import com.assettrack.backend.repository.AssetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetService {

    private final AssetRepository assetRepository;
    private final AssetAllocationRepository allocationRepository;
    private final AssetMapper assetMapper;
    private final UserMapper userMapper;

    public AssetService(AssetRepository assetRepository,
                        AssetAllocationRepository allocationRepository,
                        AssetMapper assetMapper,
                        UserMapper userMapper) {
        this.assetRepository = assetRepository;
        this.allocationRepository = allocationRepository;
        this.assetMapper = assetMapper;
        this.userMapper = userMapper;
    }

    public AssetResponse createAsset(CreateAssetRequest request) {
        if (assetRepository.findBySerialNumber(request.getSerialNumber()).isPresent()) {
            throw new ConflictException("Serial number already exists: " + request.getSerialNumber());
        }

        Asset asset = assetMapper.toEntity(request);
        asset.setStatus(AssetStatus.AVAILABLE);
        assetRepository.save(asset);

        return buildAssetResponse(asset);
    }

    public AssetResponse getAssetById(Long id) {
        Asset asset = findAssetOrThrow(id);
        return buildAssetResponse(asset);
    }

    public List<AssetSummary> getAllAssets() {
        return assetRepository.findAll()
                .stream()
                .map(assetMapper::toSummary)
                .toList();
    }

    public AssetResponse updateAsset(Long id, UpdateAssetRequest request) {
        Asset asset = findAssetOrThrow(id);
        assetMapper.updateEntity(request, asset);
        assetRepository.save(asset);
        return buildAssetResponse(asset);
    }

    public void deleteAsset(Long id) {
        if (!assetRepository.existsById(id)) {
            throw new ResourceNotFoundException("Asset not found with id: " + id);
        }
        assetRepository.deleteById(id);
    }

    public List<AssetSummary> searchAssets(String brand, String model,
                                           AssetType type, AssetStatus status) {
        List<Asset> all = assetRepository.findAll();

        return all.stream()
                .filter(a -> brand == null || a.getBrand().toLowerCase().contains(brand.toLowerCase()))
                .filter(a -> model == null || a.getModel().toLowerCase().contains(model.toLowerCase()))
                .filter(a -> type == null || a.getType() == type)
                .filter(a -> status == null || a.getStatus() == status)
                .map(assetMapper::toSummary)
                .toList();
    }

    public AssetResponse findAvailableLaptop() {
        return assetRepository
                .findByTypeAndStatus(AssetType.LAPTOP, AssetStatus.AVAILABLE)
                .stream()
                .findFirst()
                .map(asset -> {
                    AssetResponse response = buildAssetResponse(asset);
                    allocationRepository.findByAsset(asset)
                            .stream()
                            .filter(a -> a.getReturnedAt() != null)
                            .max((a, b) -> a.getReturnedAt().compareTo(b.getReturnedAt()))
                            .ifPresent(last -> response.setAssignedTo(userMapper.toSummary(last.getUser())));
                    return response;
                })
                .orElseThrow(() -> new ResourceNotFoundException("No available laptops found"));
    }

    public Asset findAssetOrThrow(Long id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));
    }

    private AssetResponse buildAssetResponse(Asset asset) {
        AssetResponse response = assetMapper.toResponse(asset);

        allocationRepository.findByAssetAndReturnedAtIsNull(asset)
                .ifPresent(allocation -> {
                    UserSummary summary = userMapper.toSummary(allocation.getUser());
                    response.setAssignedTo(summary);
                });

        return response;
    }
}