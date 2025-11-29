package com.posSystem.models;

import com.posSystem.domain.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    @Email(message = "Email should be valid")
    private String email;

    private String phone;

    @Column(nullable = false)
    private UserRole role;

    @Column(nullable = false)
    private String Password;

    private LocalDateTime createdAt;
    private LocalDateTime updateAt;
    private LocalDateTime lastLogin;


}
