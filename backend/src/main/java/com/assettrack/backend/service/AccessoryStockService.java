package com.assettrack.backend.service;

import com.assettrack.backend.domain.AccessoryStock;
import com.assettrack.backend.dto.stock.AccessoryStockResponse;
import com.assettrack.backend.dto.stock.CreateAccessoryStockRequest;
import com.assettrack.backend.dto.stock.UpdateStockQuantityRequest;
import com.assettrack.backend.exception.ResourceNotFoundException;
import com.assettrack.backend.mapper.AccessoryStockMapper;
import com.assettrack.backend.repository.AccessoryStockRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AccessoryStockService {

    private final AccessoryStockRepository stockRepository;
    private final AccessoryStockMapper stockMapper;

    public AccessoryStockService(AccessoryStockRepository stockRepository,
                                 AccessoryStockMapper stockMapper) {
        this.stockRepository = stockRepository;
        this.stockMapper = stockMapper;
    }

    public AccessoryStockResponse createStock(CreateAccessoryStockRequest request) {
        AccessoryStock stock = stockMapper.toEntity(request);
        return stockMapper.toResponse(stockRepository.save(stock));
    }

    public List<AccessoryStockResponse> getAllStock() {
        return stockRepository.findAll()
                .stream()
                .map(stockMapper::toResponse)
                .toList();
    }

    public AccessoryStockResponse getStockById(Long id) {
        return stockMapper.toResponse(findOrThrow(id));
    }

    public AccessoryStockResponse updateQuantity(Long id, UpdateStockQuantityRequest request) {
        AccessoryStock stock = findOrThrow(id);
        stockMapper.updateQuantity(request, stock);
        stock.setUpdatedAt(LocalDateTime.now());
        return stockMapper.toResponse(stockRepository.save(stock));
    }

    public void deleteStock(Long id) {
        if (!stockRepository.existsById(id)) {
            throw new ResourceNotFoundException("Stock item not found with id: " + id);
        }
        stockRepository.deleteById(id);
    }

    public List<AccessoryStockResponse> getLowStockItems() {
        return stockRepository.findLowStockAccessories()
                .stream()
                .map(stockMapper::toResponse)
                .toList();
    }

    private AccessoryStock findOrThrow(Long id) {
        return stockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock item not found with id: " + id));
    }
}