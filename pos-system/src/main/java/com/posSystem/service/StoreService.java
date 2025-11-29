package com.posSystem.service;

import com.posSystem.domain.StoreStatus;
import com.posSystem.exception.UserException;
import com.posSystem.models.Store;
import com.posSystem.models.User;
import com.posSystem.payload.dto.StoreDto;

import java.util.List;

public interface StoreService {

    StoreDto createdStore(StoreDto storeDto, User user);
    StoreDto getStore(Long id) throws Exception;
    List<StoreDto> getAllStoress();
    Store getStoreAdmin() throws Exception;
    StoreDto updateStore(Long id, StoreDto storeDto) throws Exception;
    void deleteStore(Long id) throws Exception;
    StoreDto getStoreByEmployee() throws UserException;
    StoreDto changeStoreStatus(Long id, StoreStatus status) throws Exception;
}
