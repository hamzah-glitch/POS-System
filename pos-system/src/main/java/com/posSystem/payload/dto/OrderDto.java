package com.posSystem.payload.dto;

import com.posSystem.domain.OrderStatus;
import com.posSystem.domain.PaymentType;
import com.posSystem.models.Branch;
import com.posSystem.models.Customer;
import com.posSystem.models.OrderItem;
import com.posSystem.models.User;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long id;
    private Double totalAmount;
    private Double discount;
    private String note;
    private LocalDateTime createdAt;
    private BranchDto branch;
    private Long branchId;
    private Long cashierId;
    private Long customerId;
    private UserDto cashier;
    private Customer customer;
    private PaymentType paymentType;
    private OrderStatus status;
    private List<OrderItemDto> items;
}
