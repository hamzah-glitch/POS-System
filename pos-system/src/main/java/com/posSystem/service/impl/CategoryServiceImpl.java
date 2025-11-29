package com.posSystem.service.impl;

import com.posSystem.domain.UserRole;
import com.posSystem.exception.UserException;
import com.posSystem.mapper.CategoryMapper;
import com.posSystem.models.Category;
import com.posSystem.models.Store;
import com.posSystem.models.User;
import com.posSystem.payload.dto.CategoryDto;
import com.posSystem.repository.CategoryRepository;
import com.posSystem.repository.StoreRepository;
import com.posSystem.service.CategoryService;
import com.posSystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final UserService userService;
    private final StoreRepository storeRepository;
    @Override
    public CategoryDto createCategory(CategoryDto dto) throws Exception {
        User user = userService.getCurrentUser();
        Store store =storeRepository.findById(dto.getStoreId()).orElseThrow(
                ()-> new Exception("store not found")
        );

        Category category=Category.builder()
                .store(store)
                .name(dto.getName())
                .build();

        checkAuthority(user,category.getStore());
        return CategoryMapper.toDto(categoryRepository.save(category));
    }

    @Override
    public List<CategoryDto> getCategoriesByStore(Long storeId) {

        List<Category> categories=categoryRepository.findByStoreId(storeId);

        return categories.stream().map(
                CategoryMapper::toDto
        ).collect(Collectors.toList());
    }

    @Override
    public CategoryDto updateCategory(Long id, CategoryDto dto) throws Exception {
        Category category=categoryRepository.findById(id).orElseThrow(
                ()-> new Exception("category does not exist")
        );

        User user = userService.getCurrentUser();
        checkAuthority(user,category.getStore());
        category.setName(dto.getName());
        return CategoryMapper.toDto(categoryRepository.save(category));
    }

    @Override
    public void deleteCategory(Long id) throws Exception {
        Category category=categoryRepository.findById(id).orElseThrow(
                ()-> new Exception("category does not exist")
        );

        User user = userService.getCurrentUser();

        checkAuthority(user,category.getStore());
        categoryRepository.delete(category);
    }

    private void checkAuthority(User user, Store store) throws Exception {
        boolean isAdmin = user.getRole().equals(UserRole.ROLE_STORE_ADMIN);
        boolean isManager = user.getRole().equals(UserRole.ROLE_STORE_MANAGER);
        boolean isSameStore = user.equals(store.getStoreAdmin());

        if(!(isAdmin && isSameStore) && !isManager){
            throw new Exception("you do not have permission for this category");
        }


    }
}
