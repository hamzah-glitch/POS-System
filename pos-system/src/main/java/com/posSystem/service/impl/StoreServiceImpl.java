package com.posSystem.service.impl;

import com.posSystem.domain.StoreStatus;
import com.posSystem.exception.UserException;
import com.posSystem.mapper.StoreMapper;
import com.posSystem.models.Store;
import com.posSystem.models.Branch;
import com.posSystem.models.StoreContact;
import com.posSystem.models.User;
import com.posSystem.payload.dto.StoreDto;
import com.posSystem.repository.CategoryRepository;
import com.posSystem.repository.ProductRepository;
import com.posSystem.repository.StoreRepository;
import com.posSystem.repository.UserRepository;
import com.posSystem.repository.BranchRepository;
import com.posSystem.service.StoreService;
import com.posSystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;
    private final UserService userService;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;

    @Override
    public StoreDto createdStore(StoreDto storeDto, User user) {

        Store store = StoreMapper.toEntity(storeDto, user);
        // Set superadmin as store admin
        User superAdmin = userRepository.findByEmail("admin@gmail.com");
        if (superAdmin != null) {
            store.setAdmin(superAdmin);
        }
        return StoreMapper.toDTO(storeRepository.save(store));
    }

    @Override
    public StoreDto getStore(Long id) throws Exception {

        Store store = storeRepository.findById(id).orElseThrow(
                () -> new Exception("store not found"));
        return StoreMapper.toDTO(store);
    }

    @Override
    public List<StoreDto> getAllStoress() {
        List<Store> dtos = storeRepository.findAll();
        return dtos.stream().map(StoreMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public Store getStoreAdmin() throws Exception {
        User admin = userService.getCurrentUser();
        return storeRepository.findByAdminId(admin.getId());
    }

    // Only Store Admin can make changes in the store
    @Override
    public StoreDto updateStore(Long id, StoreDto storeDto) throws Exception {

        Store existing = storeRepository.findById(id).orElseThrow(
                () -> new Exception("Store not found"));
        existing.setBrand(storeDto.getBranchName());
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

        if (storeDto.getStatus() != null) {
            existing.setStatus(storeDto.getStatus());
        }

        Store updatedStore = storeRepository.save(existing);
        return StoreMapper.toDTO(updatedStore);
    }

    // Only Store Admin Can Delete the Store

    @Override
    public void deleteStore(Long id) throws Exception {
        Store store = storeRepository.findById(id).orElseThrow(
                () -> new Exception("Store not found"));

        // Delete associated products
        productRepository.deleteAll(productRepository.findByStoreId(id));

        // Delete associated categories
        categoryRepository.deleteAll(categoryRepository.findByStoreId(id));

        // Delete associated branches
        List<Branch> branches = branchRepository.findByStoreId(id);
        for (Branch branch : branches) {
            List<User> branchUsers = userRepository.findByBranchId(branch.getId());
            for (User user : branchUsers) {
                user.setBranch(null);
                userRepository.save(user);
            }
        }
        branchRepository.deleteAll(branches);

        // Unlink associated users
        List<User> users = userRepository.findByStore(store); // Assuming findByStoreId takes Store entity as per repo
        // definition
        for (User user : users) {
            user.setStore(null);
            userRepository.save(user);
        }

        storeRepository.delete(store);
    }

    @Override
    public StoreDto getStoreByEmployee() throws UserException {

        User currentUser = userService.getCurrentUser();

        if (currentUser == null) {
            throw new UserException("you do not have permission to access this store");
        }

        return StoreMapper.toDTO(currentUser.getStore());
    }

    @Override
    public StoreDto changeStoreStatus(Long id, StoreStatus status) throws Exception {
        Store store = storeRepository.findById(id).orElseThrow(
                () -> new Exception("store not found."));

        store.setStatus(status);
        Store updatedStore = storeRepository.save(store);
        return StoreMapper.toDTO(updatedStore);
    }
}
