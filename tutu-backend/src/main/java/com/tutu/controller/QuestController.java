package com.tutu.controller;

import com.tutu.dto.ApiResponse;
import com.tutu.dto.QuestRequest;
import com.tutu.entity.Quest;
import com.tutu.security.CurrentUser;
import com.tutu.service.QuestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quests")
public class QuestController {

    private final QuestService questService;
    private final CurrentUser currentUser;

    public QuestController(QuestService questService, CurrentUser currentUser) {
        this.questService = questService;
        this.currentUser = currentUser;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Quest>>> getAllQuests() {
        Long userId = currentUser.getUserId();
        return ResponseEntity.ok(ApiResponse.success(questService.getAllQuests(userId)));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<ApiResponse<List<Quest>>> getQuestsByDate(@PathVariable String date) {
        Long userId = currentUser.getUserId();
        return ResponseEntity.ok(ApiResponse.success(questService.getQuestsByDate(userId, date)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Quest>> createQuest(@Valid @RequestBody QuestRequest request) {
        Long userId = currentUser.getUserId();
        return ResponseEntity.ok(ApiResponse.success("任务创建成功", questService.createQuest(request, userId)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Quest>> updateQuestStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(ApiResponse.success("状态更新成功", questService.updateQuestStatus(id, status)));
    }
}
