package com.posSystem.service;

import com.posSystem.exception.UserException;
import com.posSystem.models.Category;
import com.posSystem.payload.dto.CategoryDto;

import java.util.List;

public interface CategoryService {

    CategoryDto createCategory(CategoryDto dto) throws Exception;
    List<CategoryDto> getCategoriesByStore(Long storeId);
    CategoryDto updateCategory(Long id, CategoryDto dto) throws Exception;
    void deleteCategory(Long id) throws Exception;
}
