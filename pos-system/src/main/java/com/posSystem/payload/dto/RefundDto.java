package com.posSystem.payload.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.posSystem.domain.PaymentType;
import com.posSystem.models.Branch;
import com.posSystem.models.Order;
import com.posSystem.models.ShiftReport;
import com.posSystem.models.User;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefundDto {

    private Long id;

    private OrderDto order;
    private Long orderId;
    private String reason;

    private Double amount;
    private ShiftReport shiftReport;
    private Long shiftReportId;
    private UserDto cashier;
    private String cashierName;
    private Branch branch;
    private Long branchId;
    private PaymentType paymentType;
    private LocalDateTime createdAt;
}
