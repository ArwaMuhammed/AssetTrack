package com.assettrack.backend.repository;

import com.assettrack.backend.domain.AccessoryStock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccessoryStockRepository extends JpaRepository<AccessoryStock, Long> {

    List<AccessoryStock> findByQuantityLessThanEqual(Integer quantity);

    List<AccessoryStock> findByNameContainingIgnoreCase(String name);
}