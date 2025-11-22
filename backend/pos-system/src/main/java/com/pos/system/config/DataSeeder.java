package com.pos.system.config;

import com.pos.system.modules.auth.entity.Admin;
import com.pos.system.modules.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if admin exists to avoid duplicate errors
            if (userRepository.count() == 0) {
                Admin admin = new Admin();
                admin.setName("System Administrator"); // <--- ADD THIS LINE
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setPinCode("1111");

                userRepository.save(admin);
                System.out.println("--> Default Admin Created: username=admin, password=admin123");
            }
        };
    }
}