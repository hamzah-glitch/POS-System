package com.posSystem.service.impl;

import com.posSystem.models.Order;
import com.posSystem.repository.OrderRepository;
import com.posSystem.repository.ProductRepository;
import com.posSystem.repository.UserRepository;
import com.posSystem.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public Map<String, Object> getDashboardStats(Long storeId) {
        Double totalSales = orderRepository.sumTotalAmountByStoreId(storeId);
        Long totalOrders = orderRepository.countByBranch_Store_Id(storeId);
        Long totalProducts = productRepository.countByStoreId(storeId);
        Long totalEmployees = userRepository.countByStore_Id(storeId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSales", totalSales != null ? totalSales : 0.0);
        stats.put("totalOrders", totalOrders != null ? totalOrders : 0);
        stats.put("totalProducts", totalProducts != null ? totalProducts : 0);
        stats.put("totalEmployees", totalEmployees != null ? totalEmployees : 0);

        return stats;
    }

    @Override
    public List<Map<String, Object>> getSalesTrend(Long storeId, int days) {
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start = end.minusDays(days);
        return orderRepository.findDailySalesByStoreId(storeId, start, end);
    }

    @Override
    public List<Map<String, Object>> getRecentSales(Long storeId) {
        List<Order> orders = orderRepository.findTop5ByBranch_Store_IdOrderByCreatedAtDesc(storeId);
        return orders.stream().map(order -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", order.getId());
            map.put("customer", order.getCustomer() != null ? order.getCustomer().getFullName() : "Walk-in Customer");
            map.put("amount", order.getTotalAmount());
            map.put("status", "Completed"); // Assuming all orders are completed for now
            map.put("time", order.getCreatedAt());
            return map;
        }).collect(Collectors.toList());
    }
}
