package com.posSystem.repository;

import com.posSystem.models.Order;
import com.posSystem.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerId(Long customerId);

    List<Order> findByBranchId(Long branchId);

    Long countByBranchAndCreatedAtAfter(com.posSystem.models.Branch branch, java.time.LocalDateTime date);

    List<Order> findByCashierId(Long cashierId);

    List<Order> findByBranchIdAndCreatedAtBetween(Long branchId,
                                                  LocalDateTime from,
                                                  LocalDateTime to);

    List<Order> findByCashierAndCreatedAtBetween(
            User cashier, LocalDateTime from, LocalDateTime to);

    List<Order> findTop5ByBranchIdOrderByCreatedAtDesc(Long branchId);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.branch.id = :branchId")
    Double sumTotalAmountByBranchId(Long branchId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(o) FROM Order o WHERE o.branch.id = :branchId AND o.createdAt BETWEEN :start AND :end")
    Long countOrdersByBranchIdAndCreatedAtBetween(Long branchId, LocalDateTime start, LocalDateTime end);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(DISTINCT o.cashier) FROM Order o WHERE o.branch.id = :branchId AND o.createdAt BETWEEN :start AND :end")
    Long countDistinctCashiersByBranchIdAndCreatedAtBetween(Long branchId, LocalDateTime start, LocalDateTime end);

    @org.springframework.data.jpa.repository.Query("SELECT new map(FUNCTION('DATE', o.createdAt) as date, SUM(o.totalAmount) as total) FROM Order o WHERE o.branch.id = :branchId AND o.createdAt BETWEEN :start AND :end GROUP BY FUNCTION('DATE', o.createdAt) ORDER BY FUNCTION('DATE', o.createdAt)")
    List<java.util.Map<String, Object>> findDailySalesByBranchId(Long branchId, LocalDateTime start,
                                                                 LocalDateTime end);

    @org.springframework.data.jpa.repository.Query("SELECT new map(o.paymentType as type, COUNT(o) as count) FROM Order o WHERE o.branch.id = :branchId GROUP BY o.paymentType")
    List<java.util.Map<String, Object>> findSalesByPaymentMethodByBranchId(Long branchId);

    @org.springframework.data.jpa.repository.Query("SELECT new map(FUNCTION('MONTH', o.createdAt) as month, SUM(o.totalAmount) as total) FROM Order o WHERE o.branch.id = :branchId AND FUNCTION('YEAR', o.createdAt) = :year GROUP BY FUNCTION('MONTH', o.createdAt) ORDER BY FUNCTION('MONTH', o.createdAt)")
    List<java.util.Map<String, Object>> findMonthlySalesByBranchId(Long branchId, int year);

    @org.springframework.data.jpa.repository.Query("SELECT new map(oi.product.category.name as category, SUM(oi.quantity * oi.Price) as total) FROM OrderItem oi WHERE oi.order.branch.id = :branchId GROUP BY oi.product.category.name")
    List<java.util.Map<String, Object>> findSalesByCategoryByBranchId(Long branchId);

    // Store level queries
    @org.springframework.data.jpa.repository.Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.branch.store.id = :storeId")
    Double sumTotalAmountByStoreId(Long storeId);

    Long countByBranch_Store_Id(Long storeId);

    List<Order> findTop5ByBranch_Store_IdOrderByCreatedAtDesc(Long storeId);

    @org.springframework.data.jpa.repository.Query("SELECT new map(FUNCTION('DATE', o.createdAt) as date, SUM(o.totalAmount) as total) FROM Order o WHERE o.branch.store.id = :storeId AND o.createdAt BETWEEN :start AND :end GROUP BY FUNCTION('DATE', o.createdAt) ORDER BY FUNCTION('DATE', o.createdAt)")
    List<java.util.Map<String, Object>> findDailySalesByStoreId(Long storeId, LocalDateTime start,
                                                                LocalDateTime end);
}
