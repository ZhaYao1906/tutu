package com.tutu.controller;

import com.tutu.dto.AccountRequest;
import com.tutu.dto.ApiResponse;
import com.tutu.entity.Account;
import com.tutu.security.CurrentUser;
import com.tutu.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;
    private final CurrentUser currentUser;

    public AccountController(AccountService accountService, CurrentUser currentUser) {
        this.accountService = accountService;
        this.currentUser = currentUser;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Account>>> getAllAccounts() {
        Long userId = currentUser.getUserId();
        return ResponseEntity.ok(ApiResponse.success(accountService.getAllAccounts(userId)));
    }

    @GetMapping("/month/{month}")
    public ResponseEntity<ApiResponse<List<Account>>> getAccountsByMonth(@PathVariable String month) {
        Long userId = currentUser.getUserId();
        return ResponseEntity.ok(ApiResponse.success(accountService.getAccountsByMonth(userId, month)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Account>> createAccount(@Valid @RequestBody AccountRequest request) {
        Long userId = currentUser.getUserId();
        return ResponseEntity.ok(ApiResponse.success("记账成功", accountService.createAccount(request, userId)));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats(@RequestParam(required = false) String month) {
        Long userId = currentUser.getUserId();
        return ResponseEntity.ok(ApiResponse.success(accountService.getStats(userId, month)));
    }

    @GetMapping("/category-stats")
    public ResponseEntity<ApiResponse<List<Object[]>>> getCategoryStats(
            @RequestParam String month, @RequestParam String type) {
        Long userId = currentUser.getUserId();
        return ResponseEntity.ok(ApiResponse.success(accountService.getCategoryStats(userId, month, type)));
    }
}
