package com.pos.system.modules.auth.repository;

import com.pos.system.modules.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Find user for login
    Optional<User> findByUsername(String username);

    // Find user for quick PIN access
    Optional<User> findByPinCode(String pinCode);
}