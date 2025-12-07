package com.posSystem.configuration;

import com.posSystem.domain.UserRole;
import com.posSystem.models.User;
import com.posSystem.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
public class AdminInitializer {

    @Bean
    public CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@gmail.com";
            if (userRepository.findByEmail(adminEmail) == null) {
                User admin = new User();
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("12345678"));
                admin.setFullName("Super Admin");
                admin.setRole(UserRole.ROLE_ADMIN);
                admin.setCreatedAt(LocalDateTime.now());

                userRepository.save(admin);
                System.out.println("Default Admin created: " + adminEmail);
            }
        };
    }
}
