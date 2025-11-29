package com.posSystem.payload.dto;

import com.posSystem.domain.StoreStatus;
import com.posSystem.models.StoreContact;
import com.posSystem.models.User;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class StoreDto {


    private Long id;
    private String branchName;
    private UserDto storeAdmin;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String description;

    private String storeType;

    private StoreStatus status;

    private StoreContact contact;

}
