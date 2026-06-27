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
        user.setXp(user.getXp() + xpAmount);
        user.setTotalXp(user.getTotalXp() + xpAmount);
        int newLevel = user.getTotalXp() / 1000 + 1;
        if (newLevel > user.getLevel()) {
            user.setLevel(newLevel);
        }
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
}
