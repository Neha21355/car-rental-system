package com.neha.car_rental_api_spring_boot_project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NotificationResponseDTO {

    private Long id;
    private String message;
    private boolean seen;
}