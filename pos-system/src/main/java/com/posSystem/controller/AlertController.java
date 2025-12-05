package com.posSystem.controller;

import com.posSystem.payload.dto.BranchDto;
import com.posSystem.payload.dto.ProductDto;
import com.posSystem.payload.dto.UserDto;
import com.posSystem.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @GetMapping("/inactive-cashiers")
    public ResponseEntity<List<UserDto>> getInactiveCashiers() {
        return ResponseEntity.ok(alertService.getInactiveCashiers());
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductDto>> getLowStockProducts() {
        return ResponseEntity.ok(alertService.getLowStockProducts());
    }

    @GetMapping("/no-sale-today")
    public ResponseEntity<List<BranchDto>> getBranchesWithNoSalesToday() {
        return ResponseEntity.ok(alertService.getBranchesWithNoSalesToday());
    }

    @GetMapping("/refund-spikes")
    public ResponseEntity<List<Map<String, Object>>> getRefundSpikes() {
        return ResponseEntity.ok(alertService.getRefundSpikes());
    }
}
