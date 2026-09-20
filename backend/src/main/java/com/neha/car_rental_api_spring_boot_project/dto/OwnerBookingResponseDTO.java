package com.neha.car_rental_api_spring_boot_project.dto;

import java.time.LocalDate;

import com.neha.car_rental_api_spring_boot_project.enums.BookingStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OwnerBookingResponseDTO {

    private Long id;
    private LocalDate bookingDate;
    private LocalDate journeyDate;
    private String source;
    private String destination;
    private BookingStatus status;
    private Long carId;
    private String vehicleNumber;
    private String carName;
    private String customerName;
}
