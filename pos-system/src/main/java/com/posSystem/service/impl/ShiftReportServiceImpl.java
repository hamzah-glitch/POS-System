package com.posSystem.service.impl;

import com.posSystem.domain.PaymentType;
import com.posSystem.mapper.ShiftReportMapper;
import com.posSystem.models.*;
import com.posSystem.payload.dto.ShiftReportDto;
import com.posSystem.repository.*;
import com.posSystem.service.ShiftReportService;
import com.posSystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShiftReportServiceImpl implements ShiftReportService {
    private final ShiftReportRepository shiftReportRepository;
    private final UserService userService;
    private final BranchRepository branchRepository;
    private final RefundRepository refundRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    @Override
    public ShiftReportDto startShift() throws Exception {
        User currentUser = userService.getCurrentUser();
        LocalDateTime shiftStart = LocalDateTime.now();
        LocalDateTime startOfDay=shiftStart.withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay=shiftStart.withHour(23).withMinute(59).withSecond(59);

        Optional<ShiftReport> existing=shiftReportRepository.findByCashierAndShiftStartBetween(currentUser, startOfDay, endOfDay);
        if(existing.isPresent()){
            throw new Exception("Shift already started Today");
        }

        Branch branch = currentUser.getBranch();

        ShiftReport shiftReport=ShiftReport.builder()
                .cashier(currentUser)
                .shiftStart(shiftStart)
                .branch(branch)
                .build();
        ShiftReport savedReport=shiftReportRepository.save(shiftReport);
        return ShiftReportMapper.toDto(savedReport);
    }

    @Override
    public ShiftReportDto endShift() throws Exception {
        User cashier = userService.getCurrentUser();
        ShiftReport shiftReport=shiftReportRepository
                .findTopByCashierAndShiftEndIsNullOrderByShiftStartDesc(cashier)
                .orElseThrow(
                        ()-> new Exception("Shift not Found")
                );
        LocalDateTime shiftEnd=LocalDateTime.now();
        shiftReport.setShiftEnd(shiftEnd);
        List<Refund> refunds= refundRepository.findByCashierIdAndCreatedAtBetween(
                 cashier.getId() ,shiftReport.getShiftStart(), shiftReport.getShiftEnd()
        );

        double totalRefunds=refunds.stream().mapToDouble(
                refund->refund.getAmount()!=null?refund.getAmount():0.0
        ).sum();

        List<Order> orders= orderRepository.findByCashierAndCreatedAtBetween(
                cashier, shiftReport.getShiftStart(), shiftReport.getShiftEnd()
        );
        double totalSales= orders.stream().mapToDouble(Order::getTotalAmount).sum();
        double totalOrders=orders.size();
        double netSales=totalSales-totalRefunds;

        shiftReport.setTotalRefunds(totalRefunds);
        shiftReport.setTotalSales(totalSales);
        shiftReport.setTotalOrders(totalOrders);
        shiftReport.setNetSale(netSales);

        shiftReport.setRecentOrders(getRecentOrders(orders));
        shiftReport.setTopSellingProducts(getTopSellingProducts(orders));
        shiftReport.setPaymentSummaries(getPaymentSummaries(orders, totalSales));

        shiftReport.setRefunds(refunds);

        ShiftReport savedReport=shiftReportRepository.save(shiftReport);
        return ShiftReportMapper.toDto(savedReport);
    }

    @Override
    public ShiftReportDto getShiftReportById(Long shiftReportId) throws Exception {
        return shiftReportRepository.findById(shiftReportId)
                .map(
                        ShiftReportMapper::toDto
                )
                .orElseThrow(
                ()-> new Exception("shiftReport Not found")
        );
    }

    @Override
    public List<ShiftReportDto> getAllShifts() {
        List<ShiftReport> reports=shiftReportRepository.findAll();
        return reports.stream().map(
                ShiftReportMapper::toDto
        ).collect(Collectors.toList());
    }

    @Override
    public List<ShiftReportDto> getShiftReportByBranchId(Long branchId) {
        List<ShiftReport> reports=shiftReportRepository.findByBranchId(branchId);
        return reports.stream().map(
                ShiftReportMapper::toDto
        ).collect(Collectors.toList());
    }

    @Override
    public List<ShiftReportDto> getShiftReportByCashierId(Long cashierId) {
        List<ShiftReport> reports=shiftReportRepository.findByCashierId(cashierId);
        return reports.stream().map(
                ShiftReportMapper::toDto
        ).collect(Collectors.toList());
    }

    @Override
    public ShiftReportDto getCurrentShiftProgress(Long cashierId) throws Exception {
        User cashier =userService.getCurrentUser();
        ShiftReport shiftReport=shiftReportRepository.findTopByCashierAndShiftEndIsNullOrderByShiftStartDesc(cashier)
                .orElseThrow(()-> new Exception("no active shift for cashierId"));

        LocalDateTime now=LocalDateTime.now();
        List<Order> orders=orderRepository.findByCashierAndCreatedAtBetween(cashier, shiftReport.getShiftStart(), now);

        List<Refund> refunds= refundRepository.findByCashierIdAndCreatedAtBetween(
                cashier.getId() ,shiftReport.getShiftStart(), now
        );

        double totalRefunds=refunds.stream().mapToDouble(
                refund->refund.getAmount()!=null?refund.getAmount():0.0
        ).sum();

        double totalSales= orders.stream().mapToDouble(Order::getTotalAmount).sum();
        double totalOrders=orders.size();
        double netSales=totalSales-totalRefunds;

        shiftReport.setTotalRefunds(totalRefunds);
        shiftReport.setTotalSales(totalSales);
        shiftReport.setTotalOrders(totalOrders);
        shiftReport.setNetSale(netSales);

        shiftReport.setRecentOrders(getRecentOrders(orders));
        shiftReport.setTopSellingProducts(getTopSellingProducts(orders));
        shiftReport.setPaymentSummaries(getPaymentSummaries(orders, totalSales));
        shiftReport.setRefunds(refunds);

        ShiftReport savedReport=shiftReportRepository.save(shiftReport);

        return ShiftReportMapper.toDto(savedReport);
    }

    @Override
    public ShiftReportDto getShiftByCashierAndDate(Long cashierId, LocalDateTime date) throws Exception {
        User cashier= userRepository.findById(cashierId).orElseThrow(
                ()-> new Exception("User not Found with the given ID"+cashierId)
        );
        LocalDateTime start=date.withHour(0).withMinute(0).withSecond(0);
        LocalDateTime end=date.withHour(23).withMinute(59).withSecond(59);

        ShiftReport report= shiftReportRepository.findByCashierAndShiftStartBetween(
                cashier, start, end
        ).orElseThrow(
                ()-> new Exception("shift report not found for cashier "+cashierId)
        );

        return ShiftReportMapper.toDto(report);
    }
    // Helper Methods
    private List<PaymentSummary> getPaymentSummaries(List<Order> orders, double totalSales) {
        Map<PaymentType, List<Order>> grouped=orders.stream()
                .collect(Collectors.groupingBy(order->order.getPaymentType()!=null?
                        order.getPaymentType():PaymentType.CASH));

        List<PaymentSummary> summaries=new ArrayList<>();
        for(Map.Entry<PaymentType, List<Order>> entry:grouped.entrySet()) {
            double amount=entry.getValue().stream()
                    .mapToDouble(Order::getTotalAmount).sum();
            int transactions=entry.getValue().size();
            double percent=(amount/totalSales)*100;

            PaymentSummary ps=new PaymentSummary();
            ps.setPaymentType(entry.getKey());
            ps.setTotalAmount(amount);
            ps.setTransactionCount(transactions);
            ps.setPercentage(percent);
            summaries.add(ps);
        }
        return summaries;
    }

    private List<Product> getTopSellingProducts(List<Order> orders) {
        Map<Product, Integer> productSalesMap= new HashMap<>();

        for(Order order:orders) {
            for(OrderItem item:order.getItems()) {
                Product product=item.getProduct();
                productSalesMap.put(product, productSalesMap.getOrDefault(product,0)+ item.getQuantity());
            }
        }

        return productSalesMap.entrySet().stream().sorted((a,b)->b.getValue().compareTo(a.getValue()))
                .limit(5)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    private List<Order> getRecentOrders(List<Order> orders) {
        return orders.stream()
                .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                .limit(5)
                .collect(Collectors.toList());
    }
}
