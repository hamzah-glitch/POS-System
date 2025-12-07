package com.posSystem.controller;

import com.posSystem.domain.OrderStatus;
import com.posSystem.domain.PaymentType;
import com.posSystem.payload.dto.OrderDto;
import com.posSystem.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(
            @RequestBody OrderDto orderDto) throws Exception {
        return ResponseEntity.ok(
                orderService.createOrder(orderDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(
            @PathVariable Long id) throws Exception {
        return ResponseEntity.ok(
                orderService.getOrderById(id));
    }

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<OrderDto>> getOrderByBranch(
            @PathVariable Long branchId,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long cashierId,
            @RequestParam(required = false) PaymentType paymentType,
            @RequestParam(required = false) OrderStatus status) throws Exception {
        return ResponseEntity.ok(
                orderService.getOrdersByBranch(branchId, customerId, cashierId, paymentType, status));
    }

    @GetMapping("/cashier/{id}")
    public ResponseEntity<List<OrderDto>> getOrderByCashierId(
            @PathVariable Long id) throws Exception {
        return ResponseEntity.ok(
                orderService.getOrderByCashier(id));
    }

    @GetMapping("/today/branch/{id}")
    public ResponseEntity<List<OrderDto>> getTodayOrder(
            @PathVariable Long id) throws Exception {
        return ResponseEntity.ok(
                orderService.getTodayOrdersByBranchId(id));
    }

    @GetMapping("/customer/{id}")
    public ResponseEntity<List<OrderDto>> getCustomersOrder(
            @PathVariable Long id) throws Exception {
        return ResponseEntity.ok(
                orderService.getOrdersByCustomerId(id));
    }

    @GetMapping("/recent/{branchId}")
    public ResponseEntity<List<OrderDto>> getRecentOrder(
            @PathVariable Long branchId) throws Exception {
        return ResponseEntity.ok(
                orderService.getTop5RecentOrdersByBranchId(branchId)
        );

    }
    @PostMapping("/{id}/refund")
    public ResponseEntity<OrderDto> refundOrder(
            @PathVariable Long id) throws Exception {
        return ResponseEntity.ok(
                orderService.refundOrder(id)
        );
    }

}
