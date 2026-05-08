package com.assettrack.backend.controller;

import com.assettrack.backend.dto.allocation.AllocateAssetRequest;
import com.assettrack.backend.dto.allocation.AllocationResponse;
import com.assettrack.backend.service.AllocationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/allocations")
public class AllocationController {

    private final AllocationService allocationService;

    public AllocationController(AllocationService allocationService) {
        this.allocationService = allocationService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<AllocationResponse> allocateAsset(@Valid @RequestBody AllocateAssetRequest request) {
        return ResponseEntity.ok(allocationService.allocateAsset(request));
    }

    @PutMapping("/return/{assetId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<AllocationResponse> returnAsset(@PathVariable Long assetId) {
        return ResponseEntity.ok(allocationService.returnAsset(assetId));
    }

    @GetMapping("/asset/{assetId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<AllocationResponse>> getHistoryByAsset(@PathVariable Long assetId) {
        return ResponseEntity.ok(allocationService.getHistoryByAsset(assetId));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<AllocationResponse>> getHistoryByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(allocationService.getHistoryByUser(userId));
    }
}