package com.tutu.repository;

import com.tutu.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUserIdOrderByTimeDesc(Long userId);

    @Query("SELECT a FROM Account a WHERE a.user.id = :userId AND FUNCTION('DATE_FORMAT', a.time, '%Y-%m') = :month ORDER BY a.time DESC")
    List<Account> findByUserIdAndMonth(@Param("userId") Long userId, @Param("month") String month);

    @Query("SELECT a.category, SUM(a.amount) FROM Account a WHERE a.user.id = :userId AND a.type = :type AND FUNCTION('DATE_FORMAT', a.time, '%Y-%m') = :month GROUP BY a.category ORDER BY SUM(a.amount) DESC")
    List<Object[]> getCategoryStatsByMonth(@Param("userId") Long userId, @Param("type") String type, @Param("month") String month);
}
