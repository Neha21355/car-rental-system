package com.neha.car_rental_api_spring_boot_project.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;

import com.neha.car_rental_api_spring_boot_project.dto.CarRequestDTO;
import com.neha.car_rental_api_spring_boot_project.dto.CarResponseDTO;
import com.neha.car_rental_api_spring_boot_project.dto.NotificationResponseDTO;
import com.neha.car_rental_api_spring_boot_project.entity.Booking;
import com.neha.car_rental_api_spring_boot_project.enums.BookingStatus;
import com.neha.car_rental_api_spring_boot_project.service.BookingService;
import com.neha.car_rental_api_spring_boot_project.service.CarService;
import com.neha.car_rental_api_spring_boot_project.service.CarOwnerService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/carOwner")
@RequiredArgsConstructor
public class CarOwnerController {

	private final HttpSession httpSession;

	private final CarService carService;
	
	private final BookingService bookingService;

	private final CarOwnerService carOwnerService;

	@GetMapping("/logoutCarOwner")
	public ResponseEntity<?> logoutCarOwner() {

		String email = (String) httpSession.getAttribute("carOwnerSession");

		if (email == null) {

			return ResponseEntity.ok("you are not logged in");
		}

		httpSession.invalidate();

		return ResponseEntity.ok("car-owner logout successfully");
	}

	@GetMapping("/carOwnerProfile")
	public ResponseEntity<?> carOwnerProfile() {

		String email = (String) httpSession.getAttribute("carOwnerSession");

		if (email == null) {

			return ResponseEntity.ok("you are not logged in");
		}

		return ResponseEntity.ok("CarOwner performing some operation successfully");
	}

	@PostMapping("/registerCar")
	public ResponseEntity<CarResponseDTO> registerCarService(@RequestBody @Valid CarRequestDTO carRequestDTO) {

		return carService.registerCarService(carRequestDTO,httpSession);
	}
	

	@PutMapping("/updateCar/{carId}")
	public ResponseEntity<CarResponseDTO> updateCarService(@PathVariable Long carId,
			@RequestBody @Valid CarRequestDTO carRequestDTO) {

		return carService.updateCarService(carId, carRequestDTO, httpSession);
	}

	@DeleteMapping("/deleteCar/{carId}")
	public ResponseEntity<?> deleteCarService(@PathVariable Long carId) {

		return carService.deleteCarService(carId, httpSession);
	}
	@GetMapping("/getAllCars")
	public ResponseEntity<?> getAllCarsService() {
		
		String email = (String) httpSession.getAttribute("carOwnerSession");
		
		if(email == null) {
			
			return ResponseEntity.ok().body("you are not logged in please login and then try");
			
	    }	
		return carService.getAllCarsForOwnerService(httpSession);
	}
	
	@GetMapping("/getPendingBookingForCarOwner")
	public ResponseEntity<?> getPendingBookingForCarOwner() {
		return bookingService.getPendingBookingForCarOwner(httpSession);
	}

	@GetMapping("/getAllBookingsForCarOwner")
	public ResponseEntity<?> getAllBookingsForCarOwner() {
		return bookingService.getAllBookingsForCarOwner(httpSession);
	}

	@GetMapping("/notifications")
	public ResponseEntity<List<NotificationResponseDTO>> getNotifications() {
		return carOwnerService.getNotifications(httpSession);
	}

	@PatchMapping("/notifications/{notificationId}/seen")
	public ResponseEntity<NotificationResponseDTO> markNotificationSeen(@PathVariable Long notificationId) {
		return carOwnerService.markNotificationSeen(notificationId, httpSession);
	}
	
	@PostMapping("/confirmedOrRejectBookingStatus/{bookingId}/{status}")
	public ResponseEntity<?> confirmedOrRejectBookingStatus(@PathVariable Long bookingId, @PathVariable BookingStatus status) {
		
		return bookingService.confirmedOrRejectBookingStatus(bookingId, status,httpSession);
	}
}
