package com.tutu.service;

import com.tutu.entity.Achievement;
import com.tutu.entity.User;
import com.tutu.entity.UserAchievement;
import com.tutu.repository.AchievementRepository;
import com.tutu.repository.UserAchievementRepository;
import com.tutu.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final UserRepository userRepository;

    public AchievementService(AchievementRepository achievementRepository,
                              UserAchievementRepository userAchievementRepository,
                              UserRepository userRepository) {
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
        this.userRepository = userRepository;
    }

    public List<Achievement> getAllAchievements() {
        return achievementRepository.findAll();
    }

    public List<Map<String, Object>> getUserAchievements(Long userId) {
        List<Achievement> achievements = achievementRepository.findAll();
        List<UserAchievement> userAchievements = userAchievementRepository.findByUserId(userId);
        Map<Long, UserAchievement> userAchMap = new HashMap<>();
        for (UserAchievement ua : userAchievements) {
            userAchMap.put(ua.getAchievement().getId(), ua);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Achievement ach : achievements) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", ach.getId());
            map.put("icon", ach.getIcon());
            map.put("name", ach.getName());
            map.put("description", ach.getDescription());
            map.put("xp", ach.getXp());
            map.put("category", ach.getCategory());
            map.put("total", ach.getTotal());
            UserAchievement ua = userAchMap.get(ach.getId());
            map.put("progress", ua != null ? ua.getProgress() : 0);
            map.put("unlocked", ua != null && ua.getUnlocked());
            result.add(map);
        }
        return result;
    }

    public Map<String, Object> updateProgress(Long userId, Long achievementId, int progress) {
        Achievement achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new RuntimeException("成就不存在"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        int newProgress = Math.min(progress, achievement.getTotal());
        boolean unlocked = newProgress >= achievement.getTotal();

        Optional<UserAchievement> existing = userAchievementRepository.findByUserIdAndAchievementId(userId, achievementId);
        UserAchievement ua;
        if (existing.isEmpty()) {
            ua = new UserAchievement();
            ua.setUser(user);
            ua.setAchievement(achievement);
        } else {
            ua = existing.get();
        }

        boolean wasUnlocked = ua.getUnlocked() != null && ua.getUnlocked();
        ua.setProgress(newProgress);
        ua.setUnlocked(unlocked);
        if (unlocked && !wasUnlocked) {
            ua.setUnlockedAt(LocalDateTime.now());
            user.setAchievementsUnlocked(user.getAchievementsUnlocked() + 1);
            user.setXp(user.getXp() + achievement.getXp());
            user.setTotalXp(user.getTotalXp() + achievement.getXp());
            userRepository.save(user);
        }
        userAchievementRepository.save(ua);

        Map<String, Object> result = new HashMap<>();
        result.put("achievement", achievement);
        result.put("progress", newProgress);
        result.put("unlocked", unlocked);
        return result;
    }
}
