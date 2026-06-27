package com.tutu.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DailyRecordRequest {
    @NotBlank(message = "日期不能为空")
    private String date;
    private String mood;
    private Integer moodScore;
    private String diary;
    private String weather;
}
