package com.tutu.service;

import com.tutu.dto.AccountRequest;
import com.tutu.entity.Account;
import com.tutu.entity.User;
import com.tutu.repository.AccountRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserService userService;

    public AccountService(AccountRepository accountRepository, UserService userService) {
        this.accountRepository = accountRepository;
        this.userService = userService;
    }

    public List<Account> getAllAccounts(Long userId) {
        return accountRepository.findByUserIdOrderByTimeDesc(userId);
    }

    public List<Account> getAccountsByMonth(Long userId, String month) {
        return accountRepository.findByUserIdAndMonth(userId, month);
    }

    public Account createAccount(AccountRequest request, Long userId) {
        Account account = new Account();
        account.setType(request.getType());
        account.setAmount(request.getAmount());
        account.setCategory(request.getCategory());
        account.setNote(request.getNote());
        account.setUser(userService.getUserById(userId));
        return accountRepository.save(account);
    }

    public Map<String, Object> getStats(Long userId, String month) {
        List<Account> accounts;
        if (month != null) {
            accounts = accountRepository.findByUserIdAndMonth(userId, month);
        } else {
            accounts = accountRepository.findByUserIdOrderByTimeDesc(userId);
        }

        BigDecimal income = accounts.stream()
                .filter(a -> "income".equals(a.getType()))
                .map(Account::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal expense = accounts.stream()
                .filter(a -> "expense".equals(a.getType()))
                .map(Account::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> stats = new HashMap<>();
        stats.put("income", income);
        stats.put("expense", expense);
        stats.put("balance", income.subtract(expense));
        stats.put("total", accounts.size());
        return stats;
    }

    public List<Object[]> getCategoryStats(Long userId, String month, String type) {
        return accountRepository.getCategoryStatsByMonth(userId, type, month);
    }
}
