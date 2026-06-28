package com.tutu.service;

import com.tutu.dto.CustomCheckInRequest;
import com.tutu.entity.CustomCheckIn;
import com.tutu.entity.User;
import com.tutu.repository.CustomCheckInRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class CustomCheckInService {

    private final CustomCheckInRepository customCheckInRepository;
    private final UserService userService;

    public CustomCheckInService(CustomCheckInRepository customCheckInRepository, UserService userService) {
        this.customCheckInRepository = customCheckInRepository;
        this.userService = userService;
    }

    public List<Map<String, Object>> getUserCheckIns(Long userId) {
        List<CustomCheckIn> checkIns = customCheckInRepository.findByUserId(userId);
        return checkIns.stream().map(ci -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", ci.getId());
            map.put("name", ci.getName());
            map.put("description", ci.getDescription());
            map.put("latitude", ci.getLatitude());
            map.put("longitude", ci.getLongitude());
            map.put("createdAt", ci.getCreatedAt());
            return map;
        }).toList();
    }

    public Map<String, Object> createCheckIn(Long userId, CustomCheckInRequest request) {
        User user = userService.getUserById(userId);

        CustomCheckIn checkIn = new CustomCheckIn();
        checkIn.setUser(user);
        checkIn.setName(request.getName());
        checkIn.setDescription(request.getDescription());
        checkIn.setLatitude(request.getLatitude());
        checkIn.setLongitude(request.getLongitude());

        CustomCheckIn saved = customCheckInRepository.save(checkIn);

        // 奖励 XP
        userService.addXp(userId, 10);
        User updatedUser = userService.getUserById(userId);

        Map<String, Object> result = new HashMap<>();
        result.put("id", saved.getId());
        result.put("name", saved.getName());
        result.put("description", saved.getDescription());
        result.put("latitude", saved.getLatitude());
        result.put("longitude", saved.getLongitude());
        result.put("createdAt", saved.getCreatedAt());
        result.put("user", updatedUser);
        return result;
    }
}
