package com.tutu.service;

import com.tutu.entity.Spot;
import com.tutu.entity.User;
import com.tutu.entity.UserSpot;
import com.tutu.repository.SpotRepository;
import com.tutu.repository.UserSpotRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SpotService {

    private final SpotRepository spotRepository;
    private final UserSpotRepository userSpotRepository;
    private final UserService userService;

    public SpotService(SpotRepository spotRepository, UserSpotRepository userSpotRepository, UserService userService) {
        this.spotRepository = spotRepository;
        this.userSpotRepository = userSpotRepository;
        this.userService = userService;
    }

    public List<Spot> getAllSpots() {
        return spotRepository.findAll();
    }

    public List<Spot> getSpotsByType(String type) {
        return spotRepository.findByType(type);
    }

    public Spot getSpotById(Long id) {
        return spotRepository.findById(id).orElseThrow(() -> new RuntimeException("地点不存在"));
    }

    public List<Map<String, Object>> getUserSpots(Long userId) {
        List<Spot> allSpots = spotRepository.findAll();
        List<UserSpot> userSpots = userSpotRepository.findByUserId(userId);
        Map<Long, UserSpot> userSpotMap = new HashMap<>();
        for (UserSpot us : userSpots) {
            userSpotMap.put(us.getSpot().getId(), us);
        }
        return allSpots.stream().map(spot -> {
            Map<String, Object> spotMap = new HashMap<>();
            spotMap.put("id", spot.getId());
            spotMap.put("icon", spot.getIcon());
            spotMap.put("name", spot.getName());
            spotMap.put("sub", spot.getSub());
            spotMap.put("description", spot.getDescription());
            spotMap.put("rating", spot.getRating());
            spotMap.put("xp", spot.getXp());
            spotMap.put("score", spot.getScore());
            spotMap.put("price", spot.getPrice());
            spotMap.put("time", spot.getTime());
            spotMap.put("tags", spot.getTags());
            spotMap.put("type", spot.getType());
            spotMap.put("coordinates", Map.of("x", spot.getCoordinatesX(), "y", spot.getCoordinatesY()));
            spotMap.put("personal", spot.getPersonal());
            UserSpot us = userSpotMap.get(spot.getId());
            spotMap.put("visited", us != null && us.getVisited());
            return spotMap;
        }).toList();
    }

    public Map<String, Object> visitSpot(Long userId, Long spotId) {
        Spot spot = getSpotById(spotId);
        Optional<UserSpot> existing = userSpotRepository.findByUserIdAndSpotId(userId, spotId);

        boolean newVisit = false;
        if (existing.isEmpty()) {
            UserSpot userSpot = new UserSpot();
            userSpot.setUser(userService.getUserById(userId));
            userSpot.setSpot(spot);
            userSpot.setVisited(true);
            userSpot.setVisitedAt(LocalDateTime.now());
            userSpotRepository.save(userSpot);
            newVisit = true;
        } else if (!existing.get().getVisited()) {
            existing.get().setVisited(true);
            existing.get().setVisitedAt(LocalDateTime.now());
            userSpotRepository.save(existing.get());
            newVisit = true;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("success", newVisit);
        result.put("spot", spot);
        if (newVisit) {
            User updatedUser = userService.addXp(userId, spot.getXp());
            userService.incrementSpotsVisited(userId);
            result.put("user", updatedUser);
        }
        return result;
    }
}
