package com.posSystem.mapper;

import com.posSystem.models.Store;
import com.posSystem.models.User;
import com.posSystem.payload.dto.StoreDto;

public class StoreMapper {

    public static StoreDto toDTO(Store store) {
        return toDTO(store, true);
    }

    public static StoreDto toDTO(Store store, boolean includeAdmin) {
        StoreDto storeDto = new StoreDto();
        storeDto.setId(store.getId());
        storeDto.setBranchName(store.getBrand());
        storeDto.setDescription(store.getDescription());
        if (includeAdmin) {
            storeDto.setStoreAdmin(UserMapper.toDTO(store.getAdmin()));
        }
        storeDto.setStoreType(store.getStoreType());
        storeDto.setContact(store.getContact());
        storeDto.setCreatedAt(store.getCreatedAt());
        storeDto.setUpdatedAt(store.getUpdatedAt());
        storeDto.setStatus(store.getStatus());
        return storeDto;
    }

    public static Store toEntity(StoreDto storeDto, User storeAdmin) {
        Store store = new Store();
        store.setId(storeDto.getId());
        store.setBrand(storeDto.getBranchName());
        store.setDescription(storeDto.getDescription());
        store.setAdmin(storeAdmin);
        store.setStoreType(storeDto.getStoreType());
        store.setContact(storeDto.getContact());
        store.setCreatedAt(storeDto.getCreatedAt());
        store.setUpdatedAt(storeDto.getUpdatedAt());
        store.setStatus(storeDto.getStatus());

        return store;
    }
}
