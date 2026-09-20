package com.neha.car_rental_api_spring_boot_project.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.neha.car_rental_api_spring_boot_project.dto.BookingRequestDTO;
import com.neha.car_rental_api_spring_boot_project.dto.BookingResponseDTO;
import com.neha.car_rental_api_spring_boot_project.dto.CustomerBookingResponseDTO;
import com.neha.car_rental_api_spring_boot_project.dto.OwnerBookingResponseDTO;
import com.neha.car_rental_api_spring_boot_project.entity.Booking;
import com.neha.car_rental_api_spring_boot_project.entity.Car;
import com.neha.car_rental_api_spring_boot_project.entity.CarOwner;
import com.neha.car_rental_api_spring_boot_project.entity.Customer;
import com.neha.car_rental_api_spring_boot_project.entity.Notification;
import com.neha.car_rental_api_spring_boot_project.enums.BookingStatus;
import com.neha.car_rental_api_spring_boot_project.enums.CarStatus;
import com.neha.car_rental_api_spring_boot_project.mail.CarRentalEmailService;
import com.neha.car_rental_api_spring_boot_project.repository.BookingRepository;
import com.neha.car_rental_api_spring_boot_project.repository.CarOwnerRepository;
import com.neha.car_rental_api_spring_boot_project.repository.CarRepository;
import com.neha.car_rental_api_spring_boot_project.repository.CustomerRepository;
import com.neha.car_rental_api_spring_boot_project.repository.NotificationRepository;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {

	private static final Logger LOGGER = LoggerFactory.getLogger(BookingService.class);

	private final BookingRepository bookingRepository;

	private final CarService carService;

	private final CustomerRepository customerRepository;

	private final NotificationRepository notificationRepository;

	private final CarOwnerRepository carOwnerRepository;
	
	private final CarRepository carRepository;
	
	private final CarRentalEmailService carRentalEmailService;

	public ResponseEntity<?> bookCarService(Long carId, HttpSession httpSession,BookingRequestDTO bookingRequestDTO) {

		String email = (String) httpSession.getAttribute("customerSession");

		if (email == null) {

			return ResponseEntity.ok()
					.body("you are not logged in please login and then try");

		}

		// fetch car by carId and check if it is available or not
		Car car = carService.getCarByIdService(carId);
		if (car.getCarStatus() != CarStatus.AVAILABLE) {
			throw new RuntimeException("car is not available for booking");
		}

		Customer customer = customerRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("customer not found"));

		Booking booking = new Booking();
		booking.setJourneyDate(bookingRequestDTO.getJourneyDate());
		booking.setSource(bookingRequestDTO.getSource());
		booking.setDestination(bookingRequestDTO.getDestination());
		booking.setCar(car);
		booking.setCustomer(customer);
		booking.setStatus(BookingStatus.PENDING);

		Booking booking2 = bookingRepository.save(booking);
		car.setCarStatus(CarStatus.PENDING);
		carRepository.save(car);
		saveCustomerNotification(customer, "Your booking request for " + car.getBrand() + " " + car.getModel() + " was submitted and is pending approval.");
		saveOwnerNotification(car.getCarOwner(), "New booking request for " + car.getBrand() + " " + car.getModel() + " (" + car.getVehicleNumber() + ").");
		
		//send email to carowner
		try {
			carRentalEmailService.sendBookingRequestEmail(car.getCarOwner().getEmail(), customer.getName(), car.getVehicleNumber());
		} catch (RuntimeException exception) {
			LOGGER.warn("Booking {} was saved but owner notification email failed", booking2.getId(), exception);
		}

		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new BookingResponseDTO("car booked successfully", booking2));
	}

	public ResponseEntity<BookingResponseDTO> getBookingByIdService(Long bookingId) {

		Booking booking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new RuntimeException("booking not found"));

		return ResponseEntity.ok().body(new BookingResponseDTO("booking fetched successfully", booking));
	}

	public ResponseEntity<List<CustomerBookingResponseDTO>> getCustomerBookings(HttpSession httpSession) {
		String email = (String) httpSession.getAttribute("customerSession");
		if (email == null) throw new RuntimeException("not logged in please login and then try");
		Customer customer = customerRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("customer not found"));
		List<CustomerBookingResponseDTO> bookings = bookingRepository.findAllByCustomerOrderByBookingDateDesc(customer)
				.stream().map(booking -> new CustomerBookingResponseDTO(
					booking.getId(), booking.getBookingDate(), booking.getJourneyDate(), booking.getSource(),
					booking.getDestination(), booking.getStatus(), booking.getCar().getId(),
					booking.getCar().getBrand() + " " + booking.getCar().getModel(),
					booking.getCar().getVehicleNumber(), booking.getCar().getFuelType(),
					booking.getCar().getSeatingCapacity(), booking.getCar().getPricePerDay()))
				.toList();
		return ResponseEntity.ok(bookings);
	}

	/**
	 *  
	 * @param httpSession
	 * @return
	 */
	public ResponseEntity<?> getPendingBookingForCarOwner(HttpSession httpSession) {

		String email = (String) httpSession.getAttribute("carOwnerSession");

		if (email == null) {

			return ResponseEntity.ok()
					.body("you are not logged in please login and then try");

		}
		
		List<OwnerBookingResponseDTO> pendingBookings = new ArrayList<>();
		
		CarOwner carOwner=carOwnerRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("car owner not found"));

		carOwner.getCars().forEach(car -> {
			bookingRepository.findByCarAndStatus(car, BookingStatus.PENDING).ifPresent(booking -> {
				
				Car bookingCar = booking.getCar();
				pendingBookings.add(new OwnerBookingResponseDTO(
					booking.getId(), booking.getBookingDate(), booking.getJourneyDate(),
					booking.getSource(), booking.getDestination(), booking.getStatus(),
					bookingCar.getId(), bookingCar.getVehicleNumber(),
					bookingCar.getBrand() + " " + bookingCar.getModel(),
					booking.getCustomer().getName()));
			});
		});
		
		return ResponseEntity.ok().body(pendingBookings);
	}

	public ResponseEntity<?> getAllBookingsForCarOwner(HttpSession httpSession) {

		String email = (String) httpSession.getAttribute("carOwnerSession");
		if (email == null) {
			return ResponseEntity.ok().body("you are not logged in please login and then try");
		}

		CarOwner carOwner = carOwnerRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("car owner not found"));
		List<OwnerBookingResponseDTO> bookings = bookingRepository
				.findAllByCar_CarOwnerOrderByBookingDateDesc(carOwner)
				.stream().map(this::toOwnerBookingResponse).toList();
		return ResponseEntity.ok(bookings);
	}

	private OwnerBookingResponseDTO toOwnerBookingResponse(Booking booking) {

		Car bookingCar = booking.getCar();
		return new OwnerBookingResponseDTO(
				booking.getId(), booking.getBookingDate(), booking.getJourneyDate(),
				booking.getSource(), booking.getDestination(), booking.getStatus(),
				bookingCar.getId(), bookingCar.getVehicleNumber(),
				bookingCar.getBrand() + " " + bookingCar.getModel(),
				booking.getCustomer().getName());
	}
	
	public ResponseEntity<?> confirmedOrRejectBookingStatus(Long bookingId, BookingStatus status,HttpSession httpSession) {
		
		String email =(String) httpSession.getAttribute("carOwnerSession");
		
		if(email == null) {
			
			return ResponseEntity.ok().body("you are not logged in please login and then try");
		}
		
		Booking booking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new RuntimeException("booking not found"));
		
		booking.setStatus(status);
		
		Car car=booking.getCar();
		
		if(status.toString().equals("ACCEPTED")) {
			System.out.println("confirmed---booking------status"+status.toString());
			car.setCarStatus(CarStatus.OCCUPIED);
		}else {
			System.out.println("confirmed---booking------status"+status.toString());
			car.setCarStatus(CarStatus.AVAILABLE);
		}
		
		Booking updatedBooking = bookingRepository.save(booking);
		carRepository.save(car);
		
		Customer customer = booking.getCustomer();
		saveCustomerNotification(customer, "Your booking for " + car.getBrand() + " " + car.getModel() + " was " + status.name().toLowerCase() + ".");
		
		try {
			if (status == BookingStatus.ACCEPTED) {
				carRentalEmailService.sendBookingConfirmedEmail(customer.getEmail(), customer.getName(), car.getVehicleNumber());
			} else if (status == BookingStatus.REJECTED) {
				carRentalEmailService.sendBookingRejectedEmail(customer.getEmail(), customer.getName(), car.getVehicleNumber());
			} else if (status == BookingStatus.COMPLETED) {
				carRentalEmailService.sendBookingCompletedEmail(customer.getEmail(), customer.getName(), car.getVehicleNumber());
			}
		} catch (RuntimeException exception) {
			LOGGER.warn("Booking {} was updated but customer notification email failed", bookingId, exception);
		}
		
		return ResponseEntity.ok().body(new BookingResponseDTO("booking status updated successfully", updatedBooking));
	}

	private void saveCustomerNotification(Customer customer, String message) {

		Notification notification = new Notification();
		notification.setCustomer(customer);
		notification.setMessage(message);
		notification.setSeen(false);
		notificationRepository.save(notification);
	}

	private void saveOwnerNotification(CarOwner owner, String message) {

		Notification notification = new Notification();
		notification.setCarOwner(owner);
		notification.setMessage(message);
		notification.setSeen(false);
		notificationRepository.save(notification);
	}
}
