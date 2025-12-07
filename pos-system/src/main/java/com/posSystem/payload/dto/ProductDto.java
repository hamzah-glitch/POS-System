package com.posSystem.payload.dto;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {

    private Long id;
    private String name;
    private int stockQuantity;
    private String description;
    private String skuId;
    private double mrp;
    private double sellingPrice;
    private String brand;
    private String imageUrl;
    private CategoryDto category;
    private Long categoryId;
    private Long storeId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @PrePersist
    protected void onCreated() {
        stockQuantity= 100;
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        stockQuantity= 100;
        updatedAt = LocalDateTime.now();
    }
}
