package com.tutu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class AccountRequest {
    @NotBlank(message = "类型不能为空")
    private String type;
    @Positive(message = "金额必须大于0")
    private BigDecimal amount;
    @NotBlank(message = "类别不能为空")
    private String category;
    private String note;
}
