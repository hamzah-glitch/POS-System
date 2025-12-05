package com.posSystem.service.impl;

import com.posSystem.domain.OrderStatus;
import com.posSystem.domain.PaymentType;
import com.posSystem.mapper.OrderMapper;
import com.posSystem.models.*;
import com.posSystem.payload.dto.OrderDto;
import com.posSystem.repository.OrderItemRepository;
import com.posSystem.repository.OrderRepository;
import com.posSystem.repository.ProductRepository;
import com.posSystem.service.OrderService;
import com.posSystem.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.swing.plaf.BorderUIResource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final UserService userService;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    public OrderDto createOrder(OrderDto orderDto) throws Exception {
        User cashier = userService.getCurrentUser();
        Branch branch = cashier.getBranch();
        if (branch == null) {
            throw new Exception("Cashier's branch not found");
        }

        Order order = Order.builder()
                .branch(branch)
                .cashier(cashier)
                .customer(orderDto.getCustomer())
                .paymentType(orderDto.getPaymentType())
                .build();

        List<OrderItem> orderItems = orderDto.getItems().stream().map(
                orderItemDto -> {
                    Product product = productRepository.findById(orderItemDto.getProductId())
                            .orElseThrow(
                                    () -> new EntityNotFoundException(
                                            "product not found"));
                    return OrderItem.builder()
                            .product(product)
                            .quantity(orderItemDto.getQuantity())
                            .Price(product.getSellingPrice() * orderItemDto.getQuantity())
                            .order(order)
                            .build();
                }).toList();
        double total = orderItems.stream().mapToDouble(
                OrderItem::getPrice).sum();
        order.setTotalAmount(total);
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        return OrderMapper.toDto(savedOrder);
    }

    @Override
    public OrderDto getOrderById(Long id) throws Exception {
        return orderRepository.findById(id)
                .map(OrderMapper::toDto).orElseThrow(
                        () -> new Exception("order not found with id " + id));
    }

    @Override
    public List<OrderDto> getOrdersByBranch(Long branchId, Long customerId, Long cashierId, PaymentType paymentType,
                                            OrderStatus status) throws Exception {
        return orderRepository.findByBranchId(branchId).stream()
                .filter(order -> customerId == null ||
                        (order.getCustomer() != null &&
                                order.getCustomer().getId().equals(customerId)))
                .filter(order -> cashierId == null ||
                        order.getCashier() != null &&
                                order.getCashier().getId().equals(cashierId))
                .filter(order -> paymentType == null ||
                        order.getPaymentType().equals(paymentType))
                .map(OrderMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public List<OrderDto> getOrderByCashier(Long cashierId) {
        return orderRepository.findByCashierId(cashierId).stream()
                .map(OrderMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public void deleteOrder(Long id) throws Exception {
        Order order = orderRepository.findById(id)
                .orElseThrow(
                        () -> new Exception("Order not found on this id " + id));
        orderRepository.delete(order);
    }

    @Override
    public List<OrderDto> getTodayOrdersByBranchId(Long branchId) throws Exception {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        return orderRepository.findByBranchIdAndCreatedAtBetween(branchId, start, end).stream()
                .map(
                        OrderMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDto> getOrdersByCustomerId(Long customerId) throws Exception {
        return orderRepository.findByCustomerId(customerId).stream()
                .map(
                        OrderMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDto> getTop5RecentOrdersByBranchId(Long branchId) throws Exception {
        return orderRepository.findTop5ByBranchIdOrderByCreatedAtDesc(branchId)
                .stream().map(
                        OrderMapper::toDto)
                .collect(Collectors.toList());
    }
}
