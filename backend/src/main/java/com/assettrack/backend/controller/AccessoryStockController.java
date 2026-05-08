package com.assettrack.backend.controller;

import com.assettrack.backend.dto.stock.AccessoryStockResponse;
import com.assettrack.backend.dto.stock.CreateAccessoryStockRequest;
import com.assettrack.backend.dto.stock.UpdateStockQuantityRequest;
import com.assettrack.backend.service.AccessoryStockService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
public class AccessoryStockController {

    private final AccessoryStockService stockService;

    public AccessoryStockController(AccessoryStockService stockService) {
        this.stockService = stockService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<AccessoryStockResponse> createStock(@Valid @RequestBody CreateAccessoryStockRequest request) {
        return ResponseEntity.ok(stockService.createStock(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<AccessoryStockResponse>> getAllStock() {
        return ResponseEntity.ok(stockService.getAllStock());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<AccessoryStockResponse> getStockById(@PathVariable Long id) {
        return ResponseEntity.ok(stockService.getStockById(id));
    }

    @PutMapping("/{id}/quantity")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<AccessoryStockResponse> updateQuantity(@PathVariable Long id,
                                                                 @Valid @RequestBody UpdateStockQuantityRequest request) {
        return ResponseEntity.ok(stockService.updateQuantity(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteStock(@PathVariable Long id) {
        stockService.deleteStock(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<AccessoryStockResponse>> getLowStock() {
        return ResponseEntity.ok(stockService.getLowStockItems());
    }
}