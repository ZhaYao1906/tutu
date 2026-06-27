package com.tutu.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    private String avatar = "🧭";
    private Integer level = 1;
    private String title = "新手";
    private Integer xp = 0;
    private Integer totalXp = 0;
    private Integer spotsVisited = 0;
    private Integer questsCompleted = 0;
    private Integer achievementsUnlocked = 0;
    private Integer streakDays = 0;

    @Column(name = "home_name")
    private String homeName;
    @Column(name = "home_location")
    private String homeLocation;
    @Column(name = "company_name")
    private String companyName;
    @Column(name = "company_location")
    private String companyLocation;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
