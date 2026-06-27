package com.tutu.repository;

import com.tutu.entity.DailyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyRecordRepository extends JpaRepository<DailyRecord, Long> {
    List<DailyRecord> findByUserIdOrderByDateDesc(Long userId);
    Optional<DailyRecord> findByUserIdAndDate(Long userId, String date);
    List<DailyRecord> findByUserIdAndDateBetween(Long userId, String startDate, String endDate);
    boolean existsByUserIdAndDate(Long userId, String date);
}
