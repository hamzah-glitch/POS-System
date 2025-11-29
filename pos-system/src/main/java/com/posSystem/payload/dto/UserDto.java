package com.posSystem.payload.dto;

import com.posSystem.domain.UserRole;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDto {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private UserRole role;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;
    private LocalDateTime lastLogin;
    private String password;
}
