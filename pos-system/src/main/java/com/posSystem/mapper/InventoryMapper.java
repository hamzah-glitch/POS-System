package com.posSystem.mapper;

import com.posSystem.models.Branch;
import com.posSystem.models.Inventory;
import com.posSystem.models.Product;
import com.posSystem.payload.dto.InventoryDto;

public class InventoryMapper {

    public static InventoryDto toDto(Inventory inventory){
        return InventoryDto.builder()
                .id(inventory.getId())
                .branchId(inventory.getBranch().getId())
                .productId(inventory.getProduct().getId())
                .product(ProductMapper.toDto(inventory.getProduct()))
                .branch(BranchMapper.toDto(inventory.getBranch()))
                .quantity(inventory.getQuantity())
                .build();
    }

    public static Inventory toEntity(InventoryDto inventoryDto,
                                     Branch branch,
                                     Product product){
        return Inventory.builder()
                .branch(branch)
                .product(product)
                .quantity(inventoryDto.getQuantity())
                .build();
    }
}
