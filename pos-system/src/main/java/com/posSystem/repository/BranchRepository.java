package com.posSystem.repository;

import com.posSystem.models.Branch;
import com.posSystem.models.Store;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BranchRepository extends JpaRepository<Branch, Long> {

    List<Branch> findByStoreId(Long storeId);

    List<Branch> findByStore(Store store);
}
