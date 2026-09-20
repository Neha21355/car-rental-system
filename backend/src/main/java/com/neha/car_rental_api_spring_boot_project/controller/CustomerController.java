package com.neha.car_rental_api_spring_boot_project.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neha.car_rental_api_spring_boot_project.dto.BookingRequestDTO;
import com.neha.car_rental_api_spring_boot_project.dto.CustomerProfileUpdateDTO;
import com.neha.car_rental_api_spring_boot_project.service.CustomerService;
import com.neha.car_rental_api_spring_boot_project.service.BookingService;
import com.neha.car_rental_api_spring_boot_project.service.CarService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/customer")
@RequiredArgsConstructor
public class CustomerController {

	private final CarService carService;
	
	private final HttpSession httpSession;
	
	private final BookingService bookingService;

	private final CustomerService customerService;
	
	@GetMapping("/getAllCars")
	public ResponseEntity<?> getAllCarsService() {
		return carService.getAllCarsService();
	}
	
	@PostMapping("/bookCar/{carId}")
	public ResponseEntity<?> bookCarService(@PathVariable Long carId,@RequestBody @Valid BookingRequestDTO bookingRequestDTO) {

		return bookingService.bookCarService(carId, httpSession, bookingRequestDTO);
	}

	@GetMapping("/profile")
	public ResponseEntity<?> getProfile() {
		return customerService.getProfile(httpSession);
	}

	@PutMapping("/profile")
	public ResponseEntity<?> updateProfile(@RequestBody @Valid CustomerProfileUpdateDTO dto) {
		return customerService.updateProfile(dto, httpSession);
	}

	@GetMapping("/bookings")
	public ResponseEntity<?> getBookings() {
		return bookingService.getCustomerBookings(httpSession);
	}

	@GetMapping("/notifications")
	public ResponseEntity<?> getNotifications() {
		return customerService.getNotifications(httpSession);
	}

	@PatchMapping("/notifications/{notificationId}/seen")
	public ResponseEntity<?> markNotificationSeen(@PathVariable Long notificationId) {
		return customerService.markNotificationSeen(notificationId, httpSession);
	}
	
	public ResponseEntity<?> getConfirmedBookingStatus(){
		return null;
	}
		
}
