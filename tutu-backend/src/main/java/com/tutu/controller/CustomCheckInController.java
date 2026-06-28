package com.tutu.controller;

import com.tutu.dto.ApiResponse;
import com.tutu.dto.CustomCheckInRequest;
import com.tutu.security.CurrentUser;
import com.tutu.service.CustomCheckInService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/custom-check-ins")
public class CustomCheckInController {

    private final CustomCheckInService customCheckInService;
    private final CurrentUser currentUser;

    public CustomCheckInController(CustomCheckInService customCheckInService, CurrentUser currentUser) {
        this.customCheckInService = customCheckInService;
        this.currentUser = currentUser;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getUserCheckIns() {
        Long userId = currentUser.getUserId();
        return ResponseEntity.ok(ApiResponse.success(customCheckInService.getUserCheckIns(userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> createCheckIn(@RequestBody CustomCheckInRequest request) {
        Long userId = currentUser.getUserId();
        Map<String, Object> result = customCheckInService.createCheckIn(userId, request);
        return ResponseEntity.ok(ApiResponse.success("自定义打卡成功", result));
    }
}
