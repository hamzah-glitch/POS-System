package com.posSystem.mapper;

import com.posSystem.models.Order;
import com.posSystem.models.Product;
import com.posSystem.models.Refund;
import com.posSystem.models.ShiftReport;
import com.posSystem.payload.dto.OrderDto;
import com.posSystem.payload.dto.ProductDto;
import com.posSystem.payload.dto.RefundDto;
import com.posSystem.payload.dto.ShiftReportDto;

import java.util.List;
import java.util.stream.Collectors;

public class ShiftReportMapper {

    public static ShiftReportDto toDto(ShiftReport entity)
    {
        return ShiftReportDto.builder()
                .id(entity.getId())
                .shiftStart(entity.getShiftStart())
                .shiftEnd(entity.getShiftEnd())
                .totalSales(entity.getTotalSales())
                .totalOrders(entity.getTotalOrders())
                .totalOrders(entity.getTotalSales())
                .totalRefunds(entity.getTotalRefunds())
                .cashier(UserMapper.toDTO(entity.getCashier()))
                .cashierId(entity.getCashier().getId())
                .branchId(entity.getBranch().getId())
                .recentOrders(mapOrders(entity.getRecentOrders()))
                .topSellingProducts(mapProducts(entity.getTopSellingProducts()))
                .refunds(mapRefunds(entity.getRefunds()))
                .netSale(entity.getNetSale())
                .build();
    }

    private static List<RefundDto> mapRefunds(List<Refund> refunds) {
        if(refunds==null || refunds.isEmpty()) {return null;}
        return refunds.stream().map(RefundMapper::toDto).collect(Collectors.toList());
    }

    private static List<ProductDto> mapProducts(List<Product> topSellingProducts) {
        if(topSellingProducts==null || topSellingProducts.isEmpty()) {return null;}
        return topSellingProducts.stream().map(ProductMapper::toDto).collect(Collectors.toList());
    }

    private static List<OrderDto> mapOrders(List<Order> recentOrders) {
        if(recentOrders==null || recentOrders.isEmpty()) {return null;}
        return recentOrders.stream().map(OrderMapper::toDto).collect(Collectors.toList());
    }
}
