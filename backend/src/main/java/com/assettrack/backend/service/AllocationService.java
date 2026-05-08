package com.assettrack.backend.service;

import com.assettrack.backend.domain.Asset;
import com.assettrack.backend.domain.AssetAllocation;
import com.assettrack.backend.domain.AssetStatus;
import com.assettrack.backend.domain.User;
import com.assettrack.backend.dto.allocation.AllocateAssetRequest;
import com.assettrack.backend.dto.allocation.AllocationResponse;
import com.assettrack.backend.exception.ConflictException;
import com.assettrack.backend.exception.ResourceNotFoundException;
import com.assettrack.backend.mapper.AllocationMapper;
import com.assettrack.backend.repository.AssetAllocationRepository;
import com.assettrack.backend.repository.AssetRepository;
import com.assettrack.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AllocationService {

    private final AssetAllocationRepository allocationRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final AllocationMapper allocationMapper;

    public AllocationService(AssetAllocationRepository allocationRepository,
                             AssetRepository assetRepository,
                             UserRepository userRepository,
                             AllocationMapper allocationMapper) {
        this.allocationRepository = allocationRepository;
        this.assetRepository = assetRepository;
        this.userRepository = userRepository;
        this.allocationMapper = allocationMapper;
    }

    @Transactional
    public AllocationResponse allocateAsset(AllocateAssetRequest request) {
        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (asset.getStatus() != AssetStatus.AVAILABLE) {
            throw new ConflictException("Asset is not available for allocation");
        }

        allocationRepository.findByAssetAndReturnedAtIsNull(asset)
                .ifPresent(existing -> {
                    existing.setReturnedAt(LocalDateTime.now());
                    allocationRepository.save(existing);
                });

        AssetAllocation allocation = new AssetAllocation();
        allocation.setAsset(asset);
        allocation.setUser(user);

        asset.setStatus(AssetStatus.ASSIGNED);
        assetRepository.save(asset);

        return allocationMapper.toResponse(allocationRepository.save(allocation));
    }

    @Transactional
    public AllocationResponse returnAsset(Long assetId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        AssetAllocation allocation = allocationRepository
                .findByAssetAndReturnedAtIsNull(asset)
                .orElseThrow(() -> new ResourceNotFoundException("No active allocation found for this asset"));

        allocation.setReturnedAt(LocalDateTime.now());
        allocationRepository.save(allocation);

        asset.setStatus(AssetStatus.AVAILABLE);
        assetRepository.save(asset);

        return allocationMapper.toResponse(allocation);
    }

    public List<AllocationResponse> getHistoryByAsset(Long assetId) {
        Asset asset = assetRepository.findById(assetId)
                                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        return allocationRepository.findByAsset(asset)
                .stream()
                .map(allocationMapper::toResponse)
                .toList();
    }

    public List<AllocationResponse> getHistoryByUser(Long userId) {
        User user = userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return allocationRepository.findByUser(user)
                .stream()
                .map(allocationMapper::toResponse)
                .toList();
    }
}