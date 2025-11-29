package com.posSystem.service;

import com.posSystem.models.User;
import com.posSystem.payload.dto.ProductDto;

import java.util.List;

public interface ProductService {
    ProductDto CreateProduct(ProductDto productDto, User user) throws Exception;
    ProductDto UpdateProduct(Long id, ProductDto productDto, User user) throws Exception;
    void deleteProduct(Long id, User user) throws Exception;
    List<ProductDto> getProducts(User user);
    List<ProductDto> getProductByStoreId(Long storeId);
    List<ProductDto> searchByKeyword(Long storeId, String Keyword);



}
