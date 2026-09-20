package com.neha.car_rental_api_spring_boot_project.dto;

import lombok.Data;
import com.neha.car_rental_api_spring_boot_project.enums.CarStatus;

@Data
public class CarResponseDTO {

    private Long id;

    private String vehicleNumber;

    private String brand;

    private String model;

    private String fuelType;

    private Integer seatingCapacity;

    private Double pricePerDay;

    private Double pricePerKm;

    private CarStatus carStatus;
}