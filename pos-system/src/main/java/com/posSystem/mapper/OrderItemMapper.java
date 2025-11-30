package com.posSystem.mapper;

import com.posSystem.models.OrderItem;
import com.posSystem.payload.dto.OrderItemDto;

public class OrderItemMapper {

    public static OrderItemDto toDto(OrderItem orderItem) {
        if(orderItem == null) return null;
        return OrderItemDto.builder()
                .id(orderItem.getId())
                .productId(orderItem.getProduct().getId())
                .quantity(orderItem.getQuantity())
                .Price(orderItem.getPrice())
                .product(ProductMapper.toDto(orderItem.getProduct()))
                .build();
    }
}
