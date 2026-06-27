package com.tutu.service;

import com.tutu.dto.DailyRecordRequest;
import com.tutu.entity.DailyRecord;
import com.tutu.entity.User;
import com.tutu.repository.DailyRecordRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DailyRecordService {

    private final DailyRecordRepository dailyRecordRepository;
    private final UserService userService;

    public DailyRecordService(DailyRecordRepository dailyRecordRepository, UserService userService) {
        this.dailyRecordRepository = dailyRecordRepository;
        this.userService = userService;
    }

    public List<DailyRecord> getAllRecords(Long userId) {
        return dailyRecordRepository.findByUserIdOrderByDateDesc(userId);
    }

    public Optional<DailyRecord> getRecordByDate(Long userId, String date) {
        return dailyRecordRepository.findByUserIdAndDate(userId, date);
    }

    public DailyRecord createOrUpdateRecord(Long userId, DailyRecordRequest request) {
        User user = userService.getUserById(userId);
        DailyRecord record = dailyRecordRepository.findByUserIdAndDate(userId, request.getDate())
                .orElseGet(DailyRecord::new);
        record.setUser(user);
        record.setDate(request.getDate());
        record.setMood(request.getMood());
        record.setMoodScore(request.getMoodScore());
        record.setDiary(request.getDiary());
        record.setWeather(request.getWeather());
        return dailyRecordRepository.save(record);
    }

    public void deleteRecord(Long userId, Long recordId) {
        DailyRecord record = dailyRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("记录不存在"));
        if (record.getUser() == null || !record.getUser().getId().equals(userId)) {
            throw new RuntimeException("无权删除该记录");
        }
        dailyRecordRepository.delete(record);
    }

    public List<DailyRecord> getRecordsByMonth(Long userId, String yearMonth) {
        String startDate = yearMonth + "-01";
        String endDate = yearMonth + "-31";
        return dailyRecordRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
    }
}
