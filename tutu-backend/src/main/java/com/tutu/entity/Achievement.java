package com.tutu.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "achievements")
@Data
public class Achievement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String icon;
    @Column(nullable = false, length = 100)
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    private Integer xp = 0;
    @Column(nullable = false, length = 20)
    private String category;
    private Integer total = 1;
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
