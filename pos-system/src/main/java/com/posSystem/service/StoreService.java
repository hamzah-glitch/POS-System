package com.posSystem.service;

import com.posSystem.models.User;
import com.posSystem.payload.dto.StoreDto;

public interface StoreService {

    StoreDto createdStore(StoreDto storeDto, User user);
    StoreDto getStore(Long id);
}
