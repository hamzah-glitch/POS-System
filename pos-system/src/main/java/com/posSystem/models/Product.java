package com.posSystem.models;

import com.posSystem.domain.StoreStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false, unique = true)
    private String skuId;

    private double mrp;

    private double sellingPrice;

    private String brand;

    private String imageUrl;

    private int stockQuantity;

    @ManyToOne
    private Category category;

    @ManyToOne
    private Store store;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreated() {
        stockQuantity= 100;
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        stockQuantity= 100;
        updatedAt = LocalDateTime.now();
    }
}
