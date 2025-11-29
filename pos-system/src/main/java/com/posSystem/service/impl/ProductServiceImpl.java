package com.posSystem.service.impl;

import com.posSystem.mapper.ProductMapper;
import com.posSystem.models.Category;
import com.posSystem.models.Product;
import com.posSystem.models.Store;
import com.posSystem.models.User;
import com.posSystem.payload.dto.ProductDto;
import com.posSystem.repository.CategoryRepository;
import com.posSystem.repository.ProductRepository;
import com.posSystem.repository.StoreRepository;
import com.posSystem.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final CategoryRepository categoryRepository;
    @Override
    public ProductDto CreateProduct(ProductDto productDto, User user) throws Exception {
        Store store = storeRepository.findById(
                productDto.getStoreId()
        ).orElseThrow(
                ()-> new Exception("store not found")
        );
        Category category= categoryRepository.findById(
                productDto.getCategoryId()
        ).orElseThrow(
                ()-> new Exception("category not found")
        );


        Product product= ProductMapper.toEntity(productDto, store, category);
        Product savedProduct= productRepository.save(product);
        return ProductMapper.toDto(savedProduct);
    }

    @Override
    public ProductDto UpdateProduct(Long id, ProductDto productDto, User user) throws Exception {
        Product product = productRepository.findById(id).orElseThrow(
                ()-> new Exception("product not found")
        );

        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setSkuId(productDto.getSkuId());
        product.setImageUrl(productDto.getImageUrl());
        product.setMrp(productDto.getMrp());
        product.setSellingPrice(productDto.getSellingPrice());
        product.setUpdatedAt(LocalDateTime.now());

        if(productDto.getCategoryId()!=null){
            Category category= categoryRepository.findById(productDto.getId())
                    .orElseThrow(
                            ()->new Exception("category not found")
                    );

            if(category != null)
            {
                product.setCategory(category);
            }
        }

        Product savedProduct=productRepository.save(product);

        return ProductMapper.toDto(savedProduct);
    }

    @Override
    public void deleteProduct(Long id, User user) throws Exception {
        Product product = productRepository.findById(id).orElseThrow(
                ()-> new Exception("product not found")
        );

        productRepository.delete(product);
    }

    @Override
    public List<ProductDto> getProducts(User user) {
        return List.of();
    }

    @Override
    public List<ProductDto> getProductByStoreId(Long storeId) {
        List<Product> products= productRepository.findByStoreId(storeId);
        return products.stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> searchByKeyword(Long storeId, String Keyword) {
        List<Product> products= productRepository.searchByKeyword(storeId, Keyword);
        return products.stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
    }
}
