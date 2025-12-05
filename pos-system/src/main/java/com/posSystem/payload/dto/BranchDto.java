package com.posSystem.payload.dto;

import com.posSystem.models.Store;
import com.posSystem.models.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchDto {
    private Long id;

    private String name;
    private String address;
    private String phone;
    private String email;
    private List<String> workingDays;

    private LocalTime openTime;
    private LocalTime closeTime;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private StoreDto store;
    private Long storeId;
    private UserDto manager;
}
