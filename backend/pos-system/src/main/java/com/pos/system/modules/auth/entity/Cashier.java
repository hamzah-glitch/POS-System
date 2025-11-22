package com.pos.system.modules.auth.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("CASHIER")
public class Cashier extends User {

    @Override
    public String getRoleName() {
        return "CASHIER";
    }
}