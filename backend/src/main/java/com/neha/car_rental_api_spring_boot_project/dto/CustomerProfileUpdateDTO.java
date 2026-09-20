package com.neha.car_rental_api_spring_boot_project.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CustomerProfileUpdateDTO {

    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    private String phoneNumber;

    private String address;
}