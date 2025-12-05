package com.posSystem.service.impl;

import com.posSystem.exception.UserException;
import com.posSystem.mapper.BranchMapper;
import com.posSystem.models.Branch;
import com.posSystem.models.Store;
import com.posSystem.models.User;
import com.posSystem.payload.dto.BranchDto;
import com.posSystem.repository.BranchRepository;
import com.posSystem.repository.StoreRepository;
import com.posSystem.repository.UserRepository;
import com.posSystem.service.BranchService;
import com.posSystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BranchServiceImpl implements BranchService {

    private final BranchRepository branchRepository;
    private final StoreRepository storeRepository;
    private final UserService userService;
    private final UserRepository userRepository;

    @Override
    public BranchDto createBranch(BranchDto branchDto, User user) throws UserException {
        Store store = null;
        if (branchDto.getStoreId() != null) {
            store = storeRepository.findById(branchDto.getStoreId())
                    .orElseThrow(() -> new UserException("Store not found"));
        } else {
            User currentUser = userService.getCurrentUser();
            store = storeRepository.findByAdminId(currentUser.getId());
        }

        if (store == null) {
            throw new UserException("Store not found for the current user or provided ID");
        }

        Branch branch = BranchMapper.toEntity(branchDto, store);
        Branch savedBranch = branchRepository.save(branch);
        return BranchMapper.toDto(savedBranch);
    }

    @Override
    public BranchDto updateBranch(Long id, BranchDto branchDto, User user) throws Exception {
        Branch existing = branchRepository.findById(id).orElseThrow(
                () -> new Exception("branch not found"));

        existing.setName(branchDto.getName());
        existing.setWorkingDays(branchDto.getWorkingDays());
        existing.setEmail(branchDto.getEmail());
        existing.setAddress(branchDto.getAddress());
        existing.setPhone(branchDto.getPhone());
        existing.setOpenTime(branchDto.getOpenTime());
        existing.setCloseTime(branchDto.getCloseTime());
        existing.setUpdatedAt(LocalDateTime.now());

        Branch updatedBranch = branchRepository.save(existing);
        return BranchMapper.toDto(updatedBranch);
    }

    @Override
    public void deleteBranch(Long id) throws Exception {
        Branch existing = branchRepository.findById(id).orElseThrow(
                () -> new Exception("branch not found"));
        // Unlink users from branch
        List<User> branchUsers = userRepository.findByBranchId(id);
        for (User user : branchUsers) {
            user.setBranch(null);
            userRepository.save(user);
        }
        branchRepository.delete(existing);
    }

    @Override
    public List<BranchDto> getAllBranchesByStoreId(Long storeId) {
        List<Branch> branches = branchRepository.findByStoreId(storeId);
        return branches.stream().map(BranchMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public BranchDto getBranchById(Long id) throws Exception {
        Branch existing = branchRepository.findById(id).orElseThrow(
                () -> new Exception("branch not found"));
        return BranchMapper.toDto(existing);
    }
}
