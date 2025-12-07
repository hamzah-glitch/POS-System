package com.posSystem.service.impl;

import com.posSystem.domain.OrderStatus;
import com.posSystem.domain.PaymentType;
import com.posSystem.mapper.OrderMapper;
import com.posSystem.models.*;
import com.posSystem.payload.dto.OrderDto;
import com.posSystem.repository.InventoryRepository;
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
    private final InventoryRepository inventoryRepository;

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
                .discount(orderDto.getDiscount() != null ? orderDto.getDiscount() : 0.0)
                .note(orderDto.getNote())
                .status(OrderStatus.COMPLETED)
                .build();

        List<OrderItem> orderItems = orderDto.getItems().stream().map(
                orderItemDto -> {
                    Product product = productRepository.findById(orderItemDto.getProductId())
                            .orElseThrow(
                                    () -> new EntityNotFoundException(
                                            "product not found"));

                    if (product.getStockQuantity() < orderItemDto.getQuantity()) {
                        throw new RuntimeException(
                                "Insufficient stock for product: " + product.getName());
                    }

                    // Update Product Stock
                    product.setStockQuantity(
                            product.getStockQuantity() - orderItemDto.getQuantity());
                    productRepository.save(product);

                    // Update Branch Inventory
                    Inventory inventory = inventoryRepository
                            .findByProductIdAndBranchId(product.getId(), branch.getId());
                    if (inventory != null) {
                        inventory.setQuantity(
                                inventory.getQuantity() - orderItemDto.getQuantity());
                        inventoryRepository.save(inventory);
                    }

                    return OrderItem.builder()
                            .product(product)
                            .quantity(orderItemDto.getQuantity())
                            .Price(product.getSellingPrice() * orderItemDto.getQuantity())
                            .order(order)
                            .build();
                }).toList();
        double subtotal = orderItems.stream().mapToDouble(
                OrderItem::getPrice).sum();
        double discount = order.getDiscount() != null ? order.getDiscount() : 0.0;
        order.setTotalAmount(Math.max(0, subtotal - discount));
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
                .filter(order -> status == null || order.getStatus() == status)
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
    @Override
    public OrderDto refundOrder(Long id) throws Exception {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new Exception("Order not found with id " + id));

        if (order.getStatus() == OrderStatus.REFUNDED) {
            throw new Exception("Order is already refunded");
        }

        // Restore stock
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();

            // Restore Product Stock
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);

            // Restore Branch Inventory
            if (order.getBranch() != null) {
                Inventory inventory = inventoryRepository.findByProductIdAndBranchId(product.getId(),
                        order.getBranch().getId());
                if (inventory != null) {
                    inventory.setQuantity(inventory.getQuantity() + item.getQuantity());
                    inventoryRepository.save(inventory);
                }
            }
        }

        order.setStatus(OrderStatus.REFUNDED);
        Order savedOrder = orderRepository.save(order);
        return OrderMapper.toDto(savedOrder);
    }
}
