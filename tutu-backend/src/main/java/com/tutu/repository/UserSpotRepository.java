package com.tutu.repository;

import com.tutu.entity.UserSpot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSpotRepository extends JpaRepository<UserSpot, Long> {
    Optional<UserSpot> findByUserIdAndSpotId(Long userId, Long spotId);
    List<UserSpot> findByUserId(Long userId);
    long countByUserIdAndVisitedTrue(Long userId);
}
