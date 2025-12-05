package com.posSystem.controller;

import com.posSystem.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats/{storeId}")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@PathVariable Long storeId) {
        return ResponseEntity.ok(dashboardService.getDashboardStats(storeId));
    }

    @GetMapping("/sales-trend/{storeId}")
    public ResponseEntity<List<Map<String, Object>>> getSalesTrend(
            @PathVariable Long storeId,
            @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(dashboardService.getSalesTrend(storeId, days));
    }

    @GetMapping("/recent-sales/{storeId}")
    public ResponseEntity<List<Map<String, Object>>> getRecentSales(@PathVariable Long storeId) {
        return ResponseEntity.ok(dashboardService.getRecentSales(storeId));
    }
}
