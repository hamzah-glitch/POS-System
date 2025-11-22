package com.pos.system.modules.auth.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("MANAGER")
public class Manager extends User {

    @Override
    public String getRoleName() {
        return "MANAGER";
    }

    // You can add Manager-specific fields here later
    // e.g., private Double maxDiscountLimit;
}