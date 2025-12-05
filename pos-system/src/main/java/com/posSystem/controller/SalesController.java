package com.posSystem.controller;

import com.posSystem.service.SalesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SalesController {

    private final SalesService salesService;

    @GetMapping("/stats/{branchId}")
    public ResponseEntity<Map<String, Object>> getSalesStats(@PathVariable Long branchId) {
        return ResponseEntity.ok(salesService.getSalesStats(branchId));
    }

    @GetMapping("/daily/{branchId}")
    public ResponseEntity<List<Map<String, Object>>> getDailySales(
            @PathVariable Long branchId,
            @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(salesService.getDailySales(branchId, days));
    }

    @GetMapping("/payment-methods/{branchId}")
    public ResponseEntity<List<Map<String, Object>>> getSalesByPaymentMethod(@PathVariable Long branchId) {
        return ResponseEntity.ok(salesService.getSalesByPaymentMethod(branchId));
    }
}
