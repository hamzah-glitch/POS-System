package com.posSystem.service;

import java.util.List;
import java.util.Map;

public interface BranchDashboardService {
    Map<String, Object> getDashboardStats(Long branchId);

    List<Map<String, Object>> getSalesTrend(Long branchId, int days);

    List<Map<String, Object>> getRecentSales(Long branchId);
}
