package com.posSystem.service;

import com.posSystem.payload.dto.UserDto;
import com.posSystem.payload.dto.ProductDto;
import com.posSystem.payload.dto.BranchDto;
import java.util.List;
import java.util.Map;

public interface AlertService {
    List<UserDto> getInactiveCashiers();

    List<ProductDto> getLowStockProducts();

    List<BranchDto> getBranchesWithNoSalesToday();

    List<Map<String, Object>> getRefundSpikes();
}
