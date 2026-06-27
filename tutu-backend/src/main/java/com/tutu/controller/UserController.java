package com.tutu.controller;

import com.tutu.dto.ApiResponse;
import com.tutu.entity.User;
import com.tutu.security.CurrentUser;
import com.tutu.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final CurrentUser currentUser;

    public UserController(UserService userService, CurrentUser currentUser) {
        this.userService = userService;
        this.currentUser = currentUser;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getProfile() {
        Long userId = currentUser.getUserId();
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(@RequestBody Map<String, Object> updates) {
        Long userId = currentUser.getUserId();
        User user = userService.updateUser(userId, updates);
        return ResponseEntity.ok(ApiResponse.success("更新成功", user));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        Long userId = currentUser.getUserId();
        return ResponseEntity.ok(ApiResponse.success(userService.getUserStats(userId)));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<ApiResponse<List<User>>> getLeaderboard() {
        return ResponseEntity.ok(ApiResponse.success(userService.getLeaderboard()));
    }
}
