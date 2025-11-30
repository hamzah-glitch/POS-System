package com.posSystem.payload.dto;

import com.posSystem.models.Order;
import com.posSystem.models.Product;
import jakarta.persistence.ManyToOne;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemDto {
    private Long id;
    private Integer quantity;
    private Double Price;
    private Long productId;
    private ProductDto product;
    private Long orderId;
}
