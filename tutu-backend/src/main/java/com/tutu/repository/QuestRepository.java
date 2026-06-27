package com.tutu.repository;

import com.tutu.entity.Quest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestRepository extends JpaRepository<Quest, Long> {
    List<Quest> findByUserIdOrUserIdIsNullOrderByCreatedAtDesc(Long userId);
    List<Quest> findByUserIdOrUserIdIsNullAndDateOrderByCreatedAtDesc(Long userId, String date);
    long countByUserIdOrUserIdIsNullAndStatus(Long userId, String status);
}
