package com.tutu.service;

import com.tutu.entity.User;
import com.tutu.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("用户不存在"));
    }

    public User updateUser(Long id, Map<String, Object> updates) {
        User user = getUserById(id);
        if (updates.containsKey("username")) user.setUsername((String) updates.get("username"));
        if (updates.containsKey("avatar")) user.setAvatar((String) updates.get("avatar"));
        if (updates.containsKey("homeName")) user.setHomeName((String) updates.get("homeName"));
        if (updates.containsKey("homeLocation")) user.setHomeLocation((String) updates.get("homeLocation"));
        if (updates.containsKey("companyName")) user.setCompanyName((String) updates.get("companyName"));
        if (updates.containsKey("companyLocation")) user.setCompanyLocation((String) updates.get("companyLocation"));
        return userRepository.save(user);
    }

    public User addXp(Long userId, int xpAmount) {
        User user = getUserById(userId);
        user.setTotalXp(user.getTotalXp() + xpAmount);
        int newLevel = calculateLevel(user.getTotalXp());
        user.setLevel(newLevel);
        int baseXp = (int) (50L * newLevel * (newLevel - 1));
        user.setXp(user.getTotalXp() - baseXp);
        user.setTitle(getTitleForLevel(newLevel));
        return userRepository.save(user);
    }

    public User incrementSpotsVisited(Long userId) {
        User user = getUserById(userId);
        user.setSpotsVisited(user.getSpotsVisited() + 1);
        return userRepository.save(user);
    }

    public User incrementQuestsCompleted(Long userId) {
        User user = getUserById(userId);
        user.setQuestsCompleted(user.getQuestsCompleted() + 1);
        return userRepository.save(user);
    }

    public List<User> getLeaderboard() {
        return userRepository.findTop10ByOrderByTotalXpDesc();
    }

    public Map<String, Object> getUserStats(Long userId) {
        User user = getUserById(userId);
        Map<String, Object> stats = new HashMap<>();
        stats.put("level", user.getLevel());
        stats.put("xp", user.getXp());
        stats.put("totalXp", user.getTotalXp());
        stats.put("spotsVisited", user.getSpotsVisited());
        stats.put("questsCompleted", user.getQuestsCompleted());
        stats.put("achievementsUnlocked", user.getAchievementsUnlocked());
        stats.put("streakDays", user.getStreakDays());
        return stats;
    }

    /**
     * 根据总经验值计算等级。
     * 到达 level n 所需的累计总经验 = 50 * n * (n-1)
     * 解方程 50 * n * (n-1) <= totalXp 求 n，取下界。
     */
    private int calculateLevel(int totalXp) {
        if (totalXp <= 0) return 1;
        int level = (int) Math.floor((1 + Math.sqrt(1 + 2.0 * totalXp / 25.0)) / 2);
        // 修正浮点误差，确保边界值正确
        while (level > 1 && totalXp < 50L * level * (level - 1)) {
            level--;
        }
        while (totalXp >= 50L * (level + 1) * level) {
            level++;
        }
        return Math.max(1, level);
    }

    /**
     * 返回从 currentLevel 升到下一级所需的 XP（即 100 * currentLevel）。
     */
    public int getXpForNextLevel(int currentLevel) {
        if (currentLevel < 1) currentLevel = 1;
        return 100 * currentLevel;
    }

    /**
     * 根据总经验值返回等级信息。
     * 包含 level, currentXp, xpForNextLevel, totalXp。
     */
    public Map<String, Object> getLevelInfo(int totalXp) {
        int level = calculateLevel(totalXp);
        int baseXp = (int) (50L * level * (level - 1));
        int currentXp = totalXp - baseXp;
        Map<String, Object> info = new HashMap<>();
        info.put("level", level);
        info.put("currentXp", currentXp);
        info.put("xpForNextLevel", getXpForNextLevel(level));
        info.put("totalXp", totalXp);
        return info;
    }

    /**
     * 根据等级返回对应称号。
     */
    private String getTitleForLevel(int level) {
        if (level <= 5) return "新手";
        if (level <= 10) return "探索者";
        if (level <= 20) return "冒险家";
        if (level <= 35) return "勇者";
        if (level <= 50) return "精英";
        if (level <= 80) return "大师";
        return "传奇";
    }
}
