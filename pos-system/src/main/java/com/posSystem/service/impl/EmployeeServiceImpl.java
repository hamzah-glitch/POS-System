package com.posSystem.service.impl;

import com.posSystem.domain.UserRole;
import com.posSystem.mapper.UserMapper;
import com.posSystem.models.Branch;
import com.posSystem.models.Store;
import com.posSystem.models.User;
import com.posSystem.payload.dto.UserDto;
import com.posSystem.repository.BranchRepository;
import com.posSystem.repository.StoreRepository;
import com.posSystem.repository.UserRepository;
import com.posSystem.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDto createStoreEmployee(UserDto employee, Long storeId) throws Exception {
        Store store=storeRepository.findById(storeId)
                .orElseThrow(
                        ()-> new Exception("Store not found")
                );
        Branch branch=null;

        if(employee.getRole()==UserRole.ROLE_BRANCH_MANAGER){
            if(employee.getBranchId()==null)
            {
                throw new Exception("branch Id is Required to create a branch manager");
            }
            branch = branchRepository.findById(employee.getBranchId()).
                    orElseThrow(
                            ()-> new Exception("branch not found")
                    );
        }

        User user= UserMapper.toEntity(employee);
        user.setStore(store);
        user.setBranch(branch);
        user.setPassword(passwordEncoder.encode(employee.getPassword()));

        User savedEmployee= userRepository.save(user);
        if(employee.getRole()==UserRole.ROLE_BRANCH_MANAGER && branch != null){
            branch.setManager(savedEmployee);
            branchRepository.save(branch);
        }
        return UserMapper.toDTO(savedEmployee);
    }

    @Override
    public UserDto createBranchEmployee(UserDto employee, Long branchId) throws Exception {

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(
                        ()-> new Exception("branch not found")
                );

        if(employee.getRole() == UserRole.ROLE_BRANCH_CASHIER ||
        employee.getRole() == UserRole.ROLE_BRANCH_MANAGER)
        {
            User user= UserMapper.toEntity(employee);
            user.setBranch(branch);
            user.setPassword(passwordEncoder.encode(employee.getPassword()));
            return UserMapper.toDTO(userRepository.save(user));
        }
        throw new Exception("branch role not supported.");
    }

    @Override
    public User updateEmployee(Long employeeId, UserDto employeeDetails) throws Exception {
        User existingUser=userRepository.findById(employeeId)
                .orElseThrow(
                        ()-> new Exception("Employee not exist with given id")
                );

        Branch branch=branchRepository.findById(employeeDetails.getBranchId())
                        .orElseThrow(
                                ()-> new Exception("branch not found...")
                        );
        existingUser.setEmail(employeeDetails.getEmail());
        existingUser.setFullName(employeeDetails.getFullName());
        existingUser.setPassword(employeeDetails.getPassword());
        existingUser.setRole(employeeDetails.getRole());
        existingUser.setUpdateAt(LocalDateTime.now());
        existingUser.setBranch(branch);


        return userRepository.save(existingUser);
    }

    @Override
    public void deleteEmployee(Long employeeId) throws Exception {
        User employee = userRepository.findById(employeeId)
                .orElseThrow(
                        ()-> new Exception("Employee not found")
                );

        userRepository.delete(employee);
    }

    @Override
    public List<UserDto> findStoreEmployees(Long storeId, UserRole role) throws Exception {

        Store store=storeRepository.findById(storeId)
                .orElseThrow(
                        ()-> new Exception("Store not found")
                );

        return userRepository.findByStoreId(store).stream()
                .filter(
                        user -> role==null||user.getRole()==role
                )
                .map(UserMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<UserDto> findBranchEmployees(Long branchId, UserRole role) throws Exception {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(
                        ()-> new Exception("branch not found")
                );

        List<UserDto> employee= userRepository.findByBranchId(branchId)
                .stream().filter(
                      user -> role== null||   user.getRole() == role
                ).map(UserMapper::toDTO).collect(Collectors.toList());
        return employee;
    }
}
