package com.tutu.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_spots", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "spot_id"}))
@Data
public class UserSpot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "spot_id", nullable = false)
    private Spot spot;

    private Boolean visited = false;
    @Column(name = "visited_at")
    private LocalDateTime visitedAt;
}
