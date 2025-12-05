package com.posSystem.service;

import java.util.List;
import java.util.Map;

public interface ReportService {
    List<Map<String, Object>> getMonthlySales(Long branchId, int year);

    List<Map<String, Object>> getSalesByCategory(Long branchId);
}
