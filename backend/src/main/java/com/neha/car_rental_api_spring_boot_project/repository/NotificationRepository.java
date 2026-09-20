package com.neha.car_rental_api_spring_boot_project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neha.car_rental_api_spring_boot_project.entity.Customer;
import com.neha.car_rental_api_spring_boot_project.entity.CarOwner;
import com.neha.car_rental_api_spring_boot_project.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findAllByCustomerOrderByIdDesc(Customer customer);

    List<Notification> findAllByCarOwnerOrderByIdDesc(CarOwner carOwner);
}