package com.tutu.controller;

import com.tutu.dto.ApiResponse;
import com.tutu.dto.DailyRecordRequest;
import com.tutu.entity.DailyRecord;
import com.tutu.security.CurrentUser;
import com.tutu.service.DailyRecordService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/daily-records")
public class DailyRecordController {

    private final DailyRecordService dailyRecordService;
    private final CurrentUser currentUser;

    public DailyRecordController(DailyRecordService dailyRecordService, CurrentUser currentUser) {
        this.dailyRecordService = dailyRecordService;
        this.currentUser = currentUser;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DailyRecord>>> getAllRecords() {
        Long userId = currentUser.getUserId();
        return ResponseEntity.ok(ApiResponse.success(dailyRecordService.getAllRecords(userId)));
    }

    @GetMapping("/{date}")
    public ResponseEntity<ApiResponse<DailyRecord>> getRecordByDate(@PathVariable String date) {
        Long userId = currentUser.getUserId();
        return ResponseEntity.ok(ApiResponse.success(
                dailyRecordService.getRecordByDate(userId, date).orElse(null)));
    }

    @GetMapping("/month/{yearMonth}")
    public ResponseEntity<ApiResponse<List<DailyRecord>>> getRecordsByMonth(@PathVariable String yearMonth) {
        Long userId = currentUser.getUserId();
        return ResponseEntity.ok(ApiResponse.success(dailyRecordService.getRecordsByMonth(userId, yearMonth)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DailyRecord>> createOrUpdateRecord(@Valid @RequestBody DailyRecordRequest request) {
        Long userId = currentUser.getUserId();
        DailyRecord record = dailyRecordService.createOrUpdateRecord(userId, request);
        return ResponseEntity.ok(ApiResponse.success("记录保存成功", record));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRecord(@PathVariable Long id) {
        Long userId = currentUser.getUserId();
        dailyRecordService.deleteRecord(userId, id);
        return ResponseEntity.ok(ApiResponse.success("记录删除成功", null));
    }
}
