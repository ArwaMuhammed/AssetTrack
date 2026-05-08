package com.assettrack.backend.repository;

import com.assettrack.backend.domain.AccessoryStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AccessoryStockRepository extends JpaRepository<AccessoryStock, Long> {

    // For general use and reports (using a user-defined fixed quantity)
    List<AccessoryStock> findByQuantityLessThanEqual(Integer quantity);

    List<AccessoryStock> findByNameContainingIgnoreCase(String name);

    // For automated notifications (based on the minimum required quantity per item)
    @Query("SELECT a FROM AccessoryStock a WHERE a.quantity <= a.minimumRequiredQuantity")
    List<AccessoryStock> findLowStockAccessories();
}