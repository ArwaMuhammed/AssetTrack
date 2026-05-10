package com.assettrack.backend.scheduler;

import com.assettrack.backend.domain.AccessoryStock;
import com.assettrack.backend.domain.Asset;
import com.assettrack.backend.domain.NotificationType;
import com.assettrack.backend.domain.Role;
import com.assettrack.backend.domain.User;
import com.assettrack.backend.repository.AccessoryStockRepository;
import com.assettrack.backend.repository.AssetAllocationRepository;
import com.assettrack.backend.repository.AssetRepository;
import com.assettrack.backend.repository.UserRepository;
import com.assettrack.backend.service.NotificationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class AlertScheduler {

    private final AssetRepository assetRepository;
    private final AccessoryStockRepository accessoryStockRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final AssetAllocationRepository allocationRepository;

    public AlertScheduler(AssetRepository assetRepository,
                        AccessoryStockRepository accessoryStockRepository,
                        NotificationService notificationService,
                        UserRepository userRepository,
                        AssetAllocationRepository allocationRepository) {  
        this.assetRepository = assetRepository;
        this.accessoryStockRepository = accessoryStockRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.allocationRepository = allocationRepository;  
    }

    /**
     * Run daily at 8:00 AM.
     * Check for warranty expirations and low stock, and notify ADMINs and MANAGERs.
     */
    @Scheduled(cron = "0 * * * * *")
    public void checkAlertsDaily() {
        checkWarrantyExpirations();
        checkLowStock();
    }

    /**
     * You can also have a fixed rate schedule for testing purposes.
     * We'll keep this commented out or run it once on startup if needed.
     */
    // @Scheduled(fixedRate = 60000)
    // public void checkAlertsTest() {
    //     checkWarrantyExpirations();
    //     checkLowStock();
    // }

    private void checkWarrantyExpirations() {
        LocalDate today = LocalDate.now();
        LocalDate targetDate = today.plusDays(30);

        List<Asset> expiringAssets = assetRepository.findByWarrantyExpirationDateBetween(today, targetDate);
        System.out.println("=== SCHEDULER RUNNING === Found " + expiringAssets.size() + " expiring assets");
        if (expiringAssets.isEmpty()) return;

        List<User> adminsAndManagers = getAdminsAndManagers();

        for (Asset asset : expiringAssets) {
            String title = "Warranty Expiring Soon: " + asset.getBrand() + " " + asset.getModel();
            String message = String.format(
                "The warranty for asset %s (S/N: %s) will expire on %s.",
                asset.getBrand() + " " + asset.getModel(),
                asset.getSerialNumber(),
                asset.getWarrantyExpirationDate());

            // Notify admins + managers
            for (User user : adminsAndManagers) {
                notificationService.sendNotification(user, title, message, NotificationType.WARRANTY_EXPIRATION);
            }

            // Notify assigned user via active allocation
            allocationRepository.findAll().stream()
                .filter(a -> a.getAsset().getId().equals(asset.getId()))
                .filter(a -> a.getReturnedAt() == null)
                .map(a -> a.getUser())
                .findFirst()
                .ifPresent(user ->
                    notificationService.sendNotification(
                        user, title, message, NotificationType.WARRANTY_EXPIRATION));
        }
    }

    private void checkLowStock() {
        // findLowStockAccessories uses the query: quantity <= minimumRequiredQuantity
        List<AccessoryStock> lowStockItems = accessoryStockRepository.findLowStockAccessories();

        if (lowStockItems.isEmpty()) {
            return;
        }

        List<User> targetUsers = getAdminsAndManagers();

        for (AccessoryStock stock : lowStockItems) {
            String title = "Low Stock Alert: " + stock.getName();
            String message = String.format("The stock for %s is low. Current quantity: %d (Minimum required: %d).",
                    stock.getName(),
                    stock.getQuantity(),
                    stock.getMinimumRequiredQuantity());

            for (User user : targetUsers) {
                notificationService.sendNotification(user, title, message, NotificationType.LOW_STOCK);
            }
        }
    }

    private List<User> getAdminsAndManagers() {
        return userRepository.findByRoleIn(List.of(Role.ADMIN, Role.MANAGER));
    }
}
