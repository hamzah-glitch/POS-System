package com.posSystem.repository;

import com.posSystem.models.Store;
import com.posSystem.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
    List<User> findByStoreId(Store store);
    List<User> findByBranchId(Long branchId);
}
