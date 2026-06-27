package com.tutu.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QuestRequest {
    @NotBlank(message = "任务标题不能为空")
    private String title;
    private String description;
    private Integer xp = 50;
    private String difficulty = "easy";
    private String category = "work";
    private String date;
}
