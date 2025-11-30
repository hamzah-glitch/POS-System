package com.posSystem.repository;

import com.posSystem.models.OrderItem;
import com.posSystem.payload.dto.OrderItemDto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
