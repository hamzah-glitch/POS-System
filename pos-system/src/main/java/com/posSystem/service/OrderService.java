package com.posSystem.service;

import com.posSystem.domain.OrderStatus;
import com.posSystem.domain.PaymentType;
import com.posSystem.models.Order;
import com.posSystem.payload.dto.OrderDto;

import java.util.List;

public interface OrderService {

    OrderDto createOrder(OrderDto orderDto) throws Exception;
    OrderDto getOrderById(Long id) throws Exception;
    List<OrderDto> getOrdersByBranch(Long branchId,
                                     Long customerId,
                                     Long cashierId,
                                     PaymentType paymentType,
                                     OrderStatus status) throws Exception;
    List<OrderDto> getOrderByCashier(Long cashierId);
    void deleteOrder(Long id) throws Exception;
    List<OrderDto> getTodayOrdersByBranchId(Long branchId) throws Exception;
    List<OrderDto> getOrdersByCustomerId(Long customerId) throws Exception;
    List<OrderDto> getTop5RecentOrdersByBranchId(Long branchId) throws Exception;

}
