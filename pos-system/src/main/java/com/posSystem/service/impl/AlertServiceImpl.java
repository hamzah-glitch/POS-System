package com.posSystem.service.impl;

import com.posSystem.domain.UserRole;
import com.posSystem.mapper.BranchMapper;
import com.posSystem.mapper.ProductMapper;
import com.posSystem.mapper.UserMapper;
import com.posSystem.models.Branch;
import com.posSystem.models.Product;
import com.posSystem.models.Refund;
import com.posSystem.models.User;
import com.posSystem.payload.dto.BranchDto;
import com.posSystem.payload.dto.ProductDto;
import com.posSystem.payload.dto.UserDto;
import com.posSystem.repository.BranchRepository;
import com.posSystem.repository.OrderRepository;
import com.posSystem.repository.ProductRepository;
import com.posSystem.repository.RefundRepository;
import com.posSystem.repository.UserRepository;
import com.posSystem.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertServiceImpl implements AlertService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final BranchRepository branchRepository;
    private final OrderRepository orderRepository;
    private final RefundRepository refundRepository;

    @Override
    public List<UserDto> getInactiveCashiers() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<User> inactiveUsers = userRepository.findByRoleAndLastLoginBefore(UserRole.ROLE_BRANCH_CASHIER,
                sevenDaysAgo);
        return inactiveUsers.stream().map(UserMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> getLowStockProducts() {
        List<Product> lowStockProducts = productRepository.findByStockQuantityLessThan(10); // Threshold 10
        return lowStockProducts.stream().map(ProductMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public List<BranchDto> getBranchesWithNoSalesToday() {
        List<Branch> allBranches = branchRepository.findAll();
        List<Branch> noSaleBranches = new ArrayList<>();
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);

        for (Branch branch : allBranches) {
            Long orderCount = orderRepository.countByBranchAndCreatedAtAfter(branch, startOfDay);
            if (orderCount == 0) {
                noSaleBranches.add(branch);
            }
        }
        return noSaleBranches.stream().map(BranchMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getRefundSpikes() {
        LocalDateTime twentyFourHoursAgo = LocalDateTime.now().minusHours(24);
        List<Refund> refunds = refundRepository.findByCreatedAtAfter(twentyFourHoursAgo);

        // Group by cashier and sum amount
        Map<User, Double> cashierRefunds = new HashMap<>();
        for (Refund refund : refunds) {
            User cashier = refund.getCashier();
            if (cashier != null) {
                cashierRefunds.put(cashier, cashierRefunds.getOrDefault(cashier, 0.0) + refund.getAmount());
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<User, Double> entry : cashierRefunds.entrySet()) {
            if (entry.getValue() > 1000) { // Threshold for spike
                Map<String, Object> map = new HashMap<>();
                map.put("cashierName", entry.getKey().getFullName());
                map.put("amount", entry.getValue());
                map.put("reason", "High refund volume");
                map.put("id", entry.getKey().getId());
                result.add(map);
            }
        }
        return result;
    }
}
