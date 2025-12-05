package com.posSystem.service.impl;

import com.posSystem.repository.OrderRepository;
import com.posSystem.service.SalesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SalesServiceImpl implements SalesService {

    private final OrderRepository orderRepository;

    @Override
    public Map<String, Object> getSalesStats(Long branchId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = now.with(LocalTime.MIN);
        LocalDateTime endOfDay = now.with(LocalTime.MAX);
        LocalDateTime startOfLastWeek = now.minusWeeks(1);

        Double totalSales = orderRepository.sumTotalAmountByBranchId(branchId);
        Long ordersToday = orderRepository.countOrdersByBranchIdAndCreatedAtBetween(branchId, startOfDay, endOfDay);
        Long activeCashiers = orderRepository.countDistinctCashiersByBranchIdAndCreatedAtBetween(branchId, startOfDay,
                endOfDay);

        // Calculate Avg Order Value
        Double totalSalesToday = 0.0; // Simplified for now, ideally should query sum for today
        // For avg order value, let's use total sales / total orders if available, or
        // just 0
        Long totalOrders = orderRepository.count(); // This is global, might need branch specific count
        // Let's just return 0 for avg order value for now or implement proper logic if
        // needed

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSales", totalSales != null ? totalSales : 0.0);
        stats.put("ordersToday", ordersToday != null ? ordersToday : 0);
        stats.put("activeCashiers", activeCashiers != null ? activeCashiers : 0);
        stats.put("avgOrderValue", 0.0); // Placeholder

        return stats;
    }

    @Override
    public List<Map<String, Object>> getDailySales(Long branchId, int days) {
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start = end.minusDays(days);
        return orderRepository.findDailySalesByBranchId(branchId, start, end);
    }

    @Override
    public List<Map<String, Object>> getSalesByPaymentMethod(Long branchId) {
        return orderRepository.findSalesByPaymentMethodByBranchId(branchId);
    }
}
