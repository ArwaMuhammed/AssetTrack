package com.assettrack.backend.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "assets")
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private AssetType type;

    private String brand;

    private String model;

    @Column(unique = true, nullable = false)
    private String serialNumber;

    private LocalDate purchaseDate;

    private LocalDate warrantyExpirationDate;

    @Enumerated(EnumType.STRING)
    private AssetStatus status;

    @Enumerated(EnumType.STRING)
    private AssetCondition condition;

    @ManyToOne
    @JoinColumn(name = "current_assigned_user_id")
    private User currentAssignedUser;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() {
        return id;
    }

    public AssetType getType() {
        return type;
    }

    public void setType(AssetType type) {
        this.type = type;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public LocalDate getWarrantyExpirationDate() {
        return warrantyExpirationDate;
    }

    public void setWarrantyExpirationDate(LocalDate warrantyExpirationDate) {
        this.warrantyExpirationDate = warrantyExpirationDate;
    }

    public AssetStatus getStatus() {
        return status;
    }

    public void setStatus(AssetStatus status) {
        this.status = status;
    }

    public AssetCondition getCondition() {
        return condition;
    }

    public void setCondition(AssetCondition condition) {
        this.condition = condition;
    }

    public User getCurrentAssignedUser() {
        return currentAssignedUser;
    }

    public void setCurrentAssignedUser(User currentAssignedUser) {
        this.currentAssignedUser = currentAssignedUser;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}