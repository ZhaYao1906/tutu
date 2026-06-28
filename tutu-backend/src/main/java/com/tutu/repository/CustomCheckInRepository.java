package com.tutu.repository;

import com.tutu.entity.CustomCheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CustomCheckInRepository extends JpaRepository<CustomCheckIn, Long> {
    List<CustomCheckIn> findByUserId(Long userId);
}
