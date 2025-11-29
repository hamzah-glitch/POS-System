package com.posSystem.service.impl;

import com.posSystem.domain.StoreStatus;
import com.posSystem.exception.UserException;
import com.posSystem.mapper.StoreMapper;
import com.posSystem.models.Store;
import com.posSystem.models.StoreContact;
import com.posSystem.models.User;
import com.posSystem.payload.dto.StoreDto;
import com.posSystem.repository.StoreRepository;
import com.posSystem.service.StoreService;
import com.posSystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;
    private final UserService userService;

    @Override
    public StoreDto createdStore(StoreDto storeDto, User user) {

        Store store = StoreMapper.toEntity(storeDto, user);
        return StoreMapper.toDTO(storeRepository.save(store));
    }

    @Override
    public StoreDto getStore(Long id) throws Exception {

        Store store = storeRepository.findById(id).orElseThrow(
                ()-> new Exception("store not found")
        );
        return StoreMapper.toDTO(store);
    }

    @Override
    public List<StoreDto> getAllStoress() {
        List<Store> dtos =  storeRepository.findAll();
        return dtos.stream().map(StoreMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public Store getStoreAdmin() throws Exception {
        User admin = userService.getCurrentUser();
        return storeRepository.findByStoreAdminId(admin.getId());
        }



    //Only Store Admin can make changes in the store
    @Override
    public StoreDto updateStore(Long id, StoreDto storeDto) throws Exception {

        User currentUser =  userService.getCurrentUser();
        Store existing= storeRepository.findByStoreAdminId(currentUser.getId());
        if (existing == null) {
                throw new Exception("Store not Found");
            }
        existing.setBranchName(storeDto.getBranchName());
        existing.setDescription(storeDto.getDescription());

        if (storeDto.getStoreType() != null) {
            existing.setStoreType(storeDto.getStoreType());
        }

        if (storeDto.getContact() != null) {
                StoreContact contact = StoreContact.builder()
                        .address(storeDto.getContact().getAddress())
                        .phone(storeDto.getContact().getPhone())
                        .email(storeDto.getContact().getEmail())
                        .build();
                existing.setContact(contact);
        }
            Store updatedStore = storeRepository.save(existing);
            return StoreMapper.toDTO(updatedStore);
        }

    //Only Store Admin Can Delete the Store

    @Override
    public void deleteStore(Long id) throws Exception {

        Store store = getStoreAdmin();
        storeRepository.delete(store);
    }

    @Override
    public StoreDto getStoreByEmployee() throws UserException {

        User currentUser = userService.getCurrentUser();

        if(currentUser == null){
            throw new UserException("you do not have permission to access this store");
        }

        return StoreMapper.toDTO(currentUser.getStore());
    }

    @Override
    public StoreDto changeStoreStatus(Long id, StoreStatus status) throws Exception {
        Store store = storeRepository.findById(id).orElseThrow(
                ()-> new Exception("store not found.")
        );

        store.setStatus(status);
        Store updatedStore=storeRepository.save(store);
        return StoreMapper.toDTO(updatedStore);
    }
}
