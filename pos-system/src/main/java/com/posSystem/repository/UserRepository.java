package com.posSystem.repository;

import com.posSystem.models.Store;
import com.posSystem.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    List<User> findByStore_Id(Long storeId);

    List<User> findByStore(Store store);

    List<User> findByStore_IdOrBranch_Store_Id(Long storeId, Long branchStoreId);

    List<User> findByBranchId(Long branchId);

    List<User> findByRoleAndLastLoginBefore(com.posSystem.domain.UserRole role, java.time.LocalDateTime date);

    Long countByStore_Id(Long storeId);
}
