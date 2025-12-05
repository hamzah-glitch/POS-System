package com.posSystem.mapper;

import com.posSystem.models.Category;
import com.posSystem.payload.dto.CategoryDto;


public class CategoryMapper {
    public static CategoryDto toDto(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .storeId(category.getStore()!=null?category.getStore().getId():null)
                .build();
    }
}
