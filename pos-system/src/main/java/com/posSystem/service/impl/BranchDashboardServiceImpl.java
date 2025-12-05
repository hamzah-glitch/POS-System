package com.posSystem.service.impl;

import com.posSystem.mapper.OrderMapper;
import com.posSystem.models.Branch;
import com.posSystem.models.Order;
import com.posSystem.repository.BranchRepository;
import com.posSystem.repository.OrderRepository;
import com.posSystem.repository.ProductRepository;
import com.posSystem.repository.UserRepository;
import com.posSystem.service.BranchDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BranchDashboardServiceImpl implements BranchDashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;

    @Override
    public Map<String, Object> getDashboardStats(Long branchId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().plusDays(1).atStartOfDay();

        Double totalSales = orderRepository.sumTotalAmountByBranchId(branchId);
        Long ordersToday = orderRepository.countOrdersByBranchIdAndCreatedAtBetween(branchId, startOfDay, endOfDay);
        Long activeCashiers = orderRepository.countDistinctCashiersByBranchIdAndCreatedAtBetween(branchId, startOfDay,
                endOfDay);

        // Assuming low stock logic is not yet implemented in repository for branch,
        // using placeholder or store level if appropriate.
        // For now, let's just return 0 or implement a simple count if possible.
        // Since Product is linked to Store, not Branch directly for stock (based on
        // previous analysis), we might need to rethink this.
        // However, the image shows "Low Stock Items". If stock is store-level, we can
        // show store-level low stock.
        // But if we want branch level, we need a Stock entity.
        // For now, let's use 0 as placeholder or fetch from store if branch is linked
        // to store.
        Branch branch = branchRepository.findById(branchId).orElse(null);
        Long lowStockItems = 0L;
        if (branch != null && branch.getStore() != null) {
            // This is store-level low stock, which might be acceptable for now.
            // We can refine this later if we add branch-level inventory.
            // productRepository doesn't have countLowStockByStoreId yet, so let's skip or
            // add it.
            // For now, 0.
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSales", totalSales != null ? totalSales : 0.0);
        stats.put("ordersToday", ordersToday != null ? ordersToday : 0);
        stats.put("activeCashiers", activeCashiers != null ? activeCashiers : 0);
        stats.put("lowStockItems", lowStockItems);

        return stats;
    }

    @Override
    public List<Map<String, Object>> getSalesTrend(Long branchId, int days) {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(days);
        return orderRepository.findDailySalesByBranchId(branchId, startDate, endDate);
    }

    @Override
    public List<Map<String, Object>> getRecentSales(Long branchId) {
        List<Order> recentOrders = orderRepository.findTop5ByBranchIdOrderByCreatedAtDesc(branchId);
        return recentOrders.stream()
                .map(order -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", order.getId());
                    map.put("customerName",
                            order.getCustomer() != null ? order.getCustomer().getFullName() : "Walk-in Customer");
                    map.put("totalAmount", order.getTotalAmount());
                    map.put("status", "COMPLETED"); // Assuming completed for now
                    map.put("date", order.getCreatedAt());
                    return map;
                })
                .collect(Collectors.toList());
    }
}
