package com.posSystem.controller;

import com.posSystem.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/monthly-sales/{branchId}")
    public ResponseEntity<List<Map<String, Object>>> getMonthlySales(
            @PathVariable Long branchId,
            @RequestParam(defaultValue = "2025") int year) {
        return ResponseEntity.ok(reportService.getMonthlySales(branchId, year));
    }

    @GetMapping("/sales-by-category/{branchId}")
    public ResponseEntity<List<Map<String, Object>>> getSalesByCategory(@PathVariable Long branchId) {
        return ResponseEntity.ok(reportService.getSalesByCategory(branchId));
    }
}
