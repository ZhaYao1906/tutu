package com.tutu.controller;

import com.tutu.dto.ApiResponse;
import com.tutu.entity.Achievement;
import com.tutu.security.CurrentUser;
import com.tutu.service.AchievementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementService achievementService;
    private final CurrentUser currentUser;

    public AchievementController(AchievementService achievementService, CurrentUser currentUser) {
        this.achievementService = achievementService;
        this.currentUser = currentUser;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Achievement>>> getAllAchievements() {
        return ResponseEntity.ok(ApiResponse.success(achievementService.getAllAchievements()));
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getUserAchievements() {
        Long userId = currentUser.getUserId();
        return ResponseEntity.ok(ApiResponse.success(achievementService.getUserAchievements(userId)));
    }

    @PutMapping("/{id}/progress")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProgress(
            @PathVariable Long id, @RequestBody Map<String, Integer> body) {
        Long userId = currentUser.getUserId();
        int progress = body.get("progress");
        return ResponseEntity.ok(ApiResponse.success(achievementService.updateProgress(userId, id, progress)));
    }
}
