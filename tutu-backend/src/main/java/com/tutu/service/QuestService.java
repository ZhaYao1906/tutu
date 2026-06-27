package com.tutu.service;

import com.tutu.dto.QuestRequest;
import com.tutu.entity.Quest;
import com.tutu.entity.User;
import com.tutu.repository.QuestRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class QuestService {

    private final QuestRepository questRepository;
    private final UserService userService;

    public QuestService(QuestRepository questRepository, UserService userService) {
        this.questRepository = questRepository;
        this.userService = userService;
    }

    public List<Quest> getAllQuests(Long userId) {
        return questRepository.findByUserIdOrUserIdIsNullOrderByCreatedAtDesc(userId);
    }

    public List<Quest> getQuestsByDate(Long userId, String date) {
        return questRepository.findByUserIdOrUserIdIsNullAndDateOrderByCreatedAtDesc(userId, date);
    }

    public Quest createQuest(QuestRequest request, Long userId) {
        Quest quest = new Quest();
        quest.setTitle(request.getTitle());
        quest.setDescription(request.getDescription());
        quest.setXp(request.getXp());
        quest.setDifficulty(request.getDifficulty());
        quest.setCategory(request.getCategory());
        quest.setDate(request.getDate());
        quest.setStatus("available");
        quest.setUser(userService.getUserById(userId));
        return questRepository.save(quest);
    }

    public Quest updateQuestStatus(Long questId, String status) {
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new RuntimeException("任务不存在"));
        String oldStatus = quest.getStatus();
        quest.setStatus(status);
        Quest updated = questRepository.save(quest);

        if ("completed".equals(status) && !"completed".equals(oldStatus) && quest.getUser() != null) {
            userService.addXp(quest.getUser().getId(), quest.getXp());
            userService.incrementQuestsCompleted(quest.getUser().getId());
        }
        return updated;
    }
}
