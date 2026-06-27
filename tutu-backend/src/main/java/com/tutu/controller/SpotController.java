package com.tutu.controller;

import com.tutu.dto.ApiResponse;
import com.tutu.entity.Spot;
import com.tutu.security.CurrentUser;
import com.tutu.service.SpotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/spots")
public class SpotController {

    private final SpotService spotService;
    private final CurrentUser currentUser;

    public SpotController(SpotService spotService, CurrentUser currentUser) {
        this.spotService = spotService;
        this.currentUser = currentUser;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Spot>>> getAllSpots(@RequestParam(required = false) String type) {
        List<Spot> spots = type != null ? spotService.getSpotsByType(type) : spotService.getAllSpots();
        return ResponseEntity.ok(ApiResponse.success(spots));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Spot>> getSpotById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(spotService.getSpotById(id)));
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getUserSpots() {
        Long userId = currentUser.getUserId();
        return ResponseEntity.ok(ApiResponse.success(spotService.getUserSpots(userId)));
    }

    @PostMapping("/{id}/visit")
    public ResponseEntity<ApiResponse<Map<String, Object>>> visitSpot(@PathVariable Long id, @RequestBody(required = false) Map<String, Object> body) {
        Long userId = currentUser.getUserId();
        String visitTimeStr = body != null ? (String) body.get("visitTime") : null;
        Map<String, Object> result = spotService.visitSpot(userId, id, visitTimeStr);
        return ResponseEntity.ok(ApiResponse.success("打卡成功", result));
    }
}
