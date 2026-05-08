package com.assettrack.backend.controller;

import com.assettrack.backend.domain.AssetStatus;
import com.assettrack.backend.domain.AssetType;
import com.assettrack.backend.dto.asset.AssetResponse;
import com.assettrack.backend.dto.asset.AssetSummary;
import com.assettrack.backend.dto.asset.CreateAssetRequest;
import com.assettrack.backend.dto.asset.UpdateAssetRequest;
import com.assettrack.backend.service.AssetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AssetResponse> createAsset(@Valid @RequestBody CreateAssetRequest request) {
        return ResponseEntity.ok(assetService.createAsset(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER')")
    public ResponseEntity<List<AssetSummary>> getAllAssets() {
        return ResponseEntity.ok(assetService.getAllAssets());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER')")
    public ResponseEntity<AssetResponse> getAssetById(@PathVariable Long id) {
        return ResponseEntity.ok(assetService.getAssetById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<AssetResponse> updateAsset(@PathVariable Long id,
                                                     @Valid @RequestBody UpdateAssetRequest request) {
        return ResponseEntity.ok(assetService.updateAsset(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER')")
    public ResponseEntity<List<AssetSummary>> searchAssets(@RequestParam(required = false) String brand,
                                                           @RequestParam(required = false) String model,
                                                           @RequestParam(required = false) AssetType type,
                                                           @RequestParam(required = false) AssetStatus status) {
        return ResponseEntity.ok(assetService.searchAssets(brand, model, type, status));
    }

    @GetMapping("/spare-laptop")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<AssetResponse> findAvailableLaptop() {
        return ResponseEntity.ok(assetService.findAvailableLaptop());
    }
}