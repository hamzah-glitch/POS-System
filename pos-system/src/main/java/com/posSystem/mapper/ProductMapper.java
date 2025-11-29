package com.posSystem.mapper;

import com.posSystem.models.Category;
import com.posSystem.models.Product;
import com.posSystem.models.Store;
import com.posSystem.payload.dto.ProductDto;

public class ProductMapper {

    public static ProductDto toDto(Product product) {
        return ProductDto.builder().
                id(product.getId()).
                name(product.getName()).
                skuId(product.getSkuId()).
                description(product.getDescription()).
                mrp(product.getMrp()).
                sellingPrice(product.getSellingPrice()).
                storeId(product.getStore()!=null?product.getStore().getId():null).
                imageUrl(product.getImageUrl())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .category(CategoryMapper.toDto(product.getCategory()))
                .build();
        //brand(product.getBrand()).

    }

    public static Product toEntity(ProductDto productDto, Store store, Category category){
        return Product.builder()
                .name(productDto.getName())
                .store(store)
                .category(category)
                .skuId(productDto.getSkuId())
                .description(productDto.getDescription())
                .mrp(productDto.getMrp())
                .sellingPrice(productDto.getSellingPrice())
                .brand(productDto.getBrand())
                .build();
    }
}
