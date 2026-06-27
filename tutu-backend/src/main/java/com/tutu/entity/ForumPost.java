package com.tutu.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "forum_posts")
@Data
public class ForumPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String title;
    @Column(columnDefinition = "TEXT")
    private String content;
    private String category;
    private Integer likes = 0;
    private Integer comments = 0;
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
