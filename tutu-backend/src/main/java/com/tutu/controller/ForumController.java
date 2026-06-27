package com.tutu.controller;

import com.tutu.dto.ApiResponse;
import com.tutu.security.CurrentUser;
import com.tutu.service.ForumService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/forum")
public class ForumController {

    private final ForumService forumService;
    private final CurrentUser currentUser;

    public ForumController(ForumService forumService, CurrentUser currentUser) {
        this.forumService = forumService;
        this.currentUser = currentUser;
    }

    @GetMapping("/posts")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllPosts() {
        return ResponseEntity.ok(ApiResponse.success(forumService.getAllPosts()));
    }

    @GetMapping("/posts/category/{category}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPostsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(ApiResponse.success(forumService.getPostsByCategory(category)));
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(forumService.getPostById(id)));
    }

    @PostMapping("/posts")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createPost(@RequestBody Map<String, String> body) {
        Long userId = currentUser.getUserId();
        String title = body.get("title");
        String content = body.get("content");
        String category = body.get("category");
        return ResponseEntity.ok(ApiResponse.success("发帖成功", forumService.createPost(title, content, category, userId)));
    }

    @PostMapping("/posts/{id}/like")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleLike(@PathVariable Long id) {
        Long userId = currentUser.getUserId();
        return ResponseEntity.ok(ApiResponse.success(forumService.toggleLike(userId, id)));
    }
}
