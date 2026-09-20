package com.neha.car_rental_api_spring_boot_project.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neha.car_rental_api_spring_boot_project.entity.Booking;
import com.neha.car_rental_api_spring_boot_project.entity.Car;
import com.neha.car_rental_api_spring_boot_project.entity.CarOwner;
import com.neha.car_rental_api_spring_boot_project.entity.Customer;
import com.neha.car_rental_api_spring_boot_project.enums.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, Long> {

	
  	Optional<Booking> findByCarAndCustomer(Car car, Customer customer);
  	
  	Optional<Booking> findByCarAndStatus(Car car, BookingStatus status);

	List<Booking> findAllByCustomerOrderByBookingDateDesc(Customer customer);

	List<Booking> findAllByCar_CarOwnerOrderByBookingDateDesc(CarOwner carOwner);
}
