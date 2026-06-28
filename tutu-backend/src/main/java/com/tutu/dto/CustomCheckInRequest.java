package com.tutu.dto;

import lombok.Data;

@Data
public class CustomCheckInRequest {
    private String name;
    private String description;
    private Double latitude;
    private Double longitude;
}
