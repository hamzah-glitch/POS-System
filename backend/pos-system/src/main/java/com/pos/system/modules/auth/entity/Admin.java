package com.pos.system.modules.auth.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("ADMIN")
public class Admin extends User {

    @Override
    public String getRoleName() {
        return "ADMIN";
    }
}