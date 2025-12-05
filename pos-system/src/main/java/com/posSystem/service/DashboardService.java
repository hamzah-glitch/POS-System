package com.posSystem.service;

import java.util.List;
import java.util.Map;

public interface DashboardService {
    Map<String, Object> getDashboardStats(Long storeId);

    List<Map<String, Object>> getSalesTrend(Long storeId, int days);

    List<Map<String, Object>> getRecentSales(Long storeId);
}
