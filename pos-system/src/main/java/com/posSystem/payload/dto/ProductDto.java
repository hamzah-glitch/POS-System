package com.posSystem.payload.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProductDto {

    private Long id;
    private String name;

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
}
