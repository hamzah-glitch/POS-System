package com.posSystem.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface SalesService {
    Map<String, Object> getSalesStats(Long branchId);

    List<Map<String, Object>> getDailySales(Long branchId, int days);

    List<Map<String, Object>> getSalesByPaymentMethod(Long branchId);
}
