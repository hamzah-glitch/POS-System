package com.posSystem.repository;

import com.posSystem.models.Refund;
import com.posSystem.models.User;
import org.springframework.boot.security.autoconfigure.SecurityProperties;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RefundRepository extends JpaRepository<Refund, Long> {

    List<Refund> findByCashierIdAndCreatedAtBetween(
            Long cashier,
            LocalDateTime from,
            LocalDateTime to);

    List<Refund> findByCashierId(Long id);

    List<Refund> findByShiftReportId(Long id);

    List<Refund> findByBranchId(Long branchId);

    List<Refund> findByCreatedAtAfter(java.time.LocalDateTime date);
}
