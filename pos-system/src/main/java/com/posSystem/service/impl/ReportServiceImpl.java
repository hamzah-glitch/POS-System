package com.posSystem.service.impl;

import com.posSystem.repository.OrderRepository;
import com.posSystem.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final OrderRepository orderRepository;

    @Override
    public List<Map<String, Object>> getMonthlySales(Long branchId, int year) {
        return orderRepository.findMonthlySalesByBranchId(branchId, year);
    }

    @Override
    public List<Map<String, Object>> getSalesByCategory(Long branchId) {
        return orderRepository.findSalesByCategoryByBranchId(branchId);
    }
}
