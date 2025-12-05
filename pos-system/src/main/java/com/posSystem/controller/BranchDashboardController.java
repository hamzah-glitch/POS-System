package com.posSystem.controller;

import com.posSystem.service.BranchDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/branch-dashboard")
@RequiredArgsConstructor
public class BranchDashboardController {

    private final BranchDashboardService branchDashboardService;

    @GetMapping("/stats/{branchId}")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@PathVariable Long branchId) {
        return ResponseEntity.ok(branchDashboardService.getDashboardStats(branchId));
    }

    @GetMapping("/sales-trend/{branchId}")
    public ResponseEntity<List<Map<String, Object>>> getSalesTrend(@PathVariable Long branchId) {
        return ResponseEntity.ok(branchDashboardService.getSalesTrend(branchId, 7)); // Default to 7 days
    }

    @GetMapping("/recent-sales/{branchId}")
    public ResponseEntity<List<Map<String, Object>>> getRecentSales(@PathVariable Long branchId) {
        return ResponseEntity.ok(branchDashboardService.getRecentSales(branchId));
    }
}
