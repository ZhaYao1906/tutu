package com.tutu.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "spots")
@Data
public class Spot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String icon;
    @Column(nullable = false, length = 100)
    private String name;
    private String sub;
    @Column(columnDefinition = "TEXT")
    private String description;
    private Integer rating = 0;
    private Integer xp = 0;
    private String score;
    private String price;
    private String time;
    @Column(columnDefinition = "JSON")
    private String tags;
    @Column(nullable = false, length = 20)
    private String type;
    @Column(name = "coordinates_x", nullable = false)
    private Integer coordinatesX;
    @Column(name = "coordinates_y", nullable = false)
    private Integer coordinatesY;
    private Boolean personal = false;
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
