package com.neha.car_rental_api_spring_boot_project.service;

import java.util.List;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.neha.car_rental_api_spring_boot_project.dto.CarOwnerRequestDTO;
import com.neha.car_rental_api_spring_boot_project.dto.CarOwnerResponseDTO;
import com.neha.car_rental_api_spring_boot_project.dto.LoginRequestDTO;
import com.neha.car_rental_api_spring_boot_project.entity.CarOwner;
import com.neha.car_rental_api_spring_boot_project.entity.Role;
import com.neha.car_rental_api_spring_boot_project.entity.Notification;
import com.neha.car_rental_api_spring_boot_project.dto.NotificationResponseDTO;
import com.neha.car_rental_api_spring_boot_project.exception.EmailAllreadyExistException;
import com.neha.car_rental_api_spring_boot_project.exception.InvalidEmailException;
import com.neha.car_rental_api_spring_boot_project.exception.InvalidPasswordException;
import com.neha.car_rental_api_spring_boot_project.exception.RoleNotFoundException;
import com.neha.car_rental_api_spring_boot_project.mapper.CarOwnerMapper;
import com.neha.car_rental_api_spring_boot_project.repository.CarOwnerRepository;
import com.neha.car_rental_api_spring_boot_project.repository.RoleRepository;
import com.neha.car_rental_api_spring_boot_project.repository.NotificationRepository;

import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CarOwnerService {

	private static final Logger LOGGER = LoggerFactory.getLogger(CarOwnerService.class);

	private final CarOwnerRepository carOwnerRepository;

	private final PasswordEncoder passwordEncoder;

	private final CarOwnerMapper carOwnerMapper;

	private final RoleRepository roleRepository;

	private final NotificationRepository notificationRepository;

	@Transactional
	public CarOwnerResponseDTO registerCarOwner(CarOwnerRequestDTO carOwnerRequestDTO) {

		LOGGER.info("registerCarOwner execution started");

		String email = carOwnerRequestDTO.getEmail().trim().toLowerCase(Locale.ROOT);

		// Implement the logic to register a car owner
		if (carOwnerRepository.existsByEmail(email)) {
			throw new EmailAllreadyExistException("Car owner with email " + email + " already exists");
		}

		// check role
		Role role = roleRepository.findByName("Role_CarOwner")
				.orElseThrow(() -> new RoleNotFoundException("Role is not available"));

		// convert requestDto to entity
		CarOwner carOwner = carOwnerMapper.toCarOwner(carOwnerRequestDTO);

		// Encode the password before saving
		carOwner.setPassword(passwordEncoder.encode(carOwnerRequestDTO.getPassword()));
		carOwner.setEmail(email);
		carOwner.setRoles(List.of(role));

		// Save the car owner to the database
		CarOwner dbCarOwner = carOwnerRepository.save(carOwner);

		LOGGER.info("data saved in db and registerCarOwner execution ended");
		// convert dbsaved entity to responseDTO
		return carOwnerMapper.toCarOwnerResponseDTO(dbCarOwner);
	}

	public ResponseEntity<String> loginCarOwnerService(LoginRequestDTO requestDTO, HttpSession httpSession) {

		LOGGER.info("loginCarOwnerService() method execution started");

		String email = requestDTO.getEmail().trim().toLowerCase(Locale.ROOT);
		CarOwner carOwner = carOwnerRepository.findByEmail(email)
				.orElseThrow(() -> new InvalidEmailException("invalid email " + email));

		if (!passwordEncoder.matches(requestDTO.getPassword(), carOwner.getPassword())) {
			throw new InvalidPasswordException("invalid password");
		}

		httpSession.setAttribute("carOwnerSession", carOwner.getEmail());
		httpSession.removeAttribute("customerSession");

		LOGGER.info("carOwner with email " + email + "logged in successfully!!!");

		return ResponseEntity.ok("login successfully");
	}

	public ResponseEntity<List<NotificationResponseDTO>> getNotifications(HttpSession httpSession) {

		CarOwner owner = getLoggedInOwner(httpSession);
		return ResponseEntity.ok(notificationRepository.findAllByCarOwnerOrderByIdDesc(owner)
				.stream().map(notification -> new NotificationResponseDTO(
						notification.getId(), notification.getMessage(), notification.isSeen())).toList());
	}

	public ResponseEntity<NotificationResponseDTO> markNotificationSeen(Long notificationId, HttpSession httpSession) {

		CarOwner owner = getLoggedInOwner(httpSession);
		Notification notification = notificationRepository.findById(notificationId)
				.orElseThrow(() -> new RuntimeException("notification not found"));
		if (notification.getCarOwner() == null || !notification.getCarOwner().getId().equals(owner.getId())) {
			throw new RuntimeException("notification does not belong to car owner");
		}
		notification.setSeen(true);
		Notification saved = notificationRepository.save(notification);
		return ResponseEntity.ok(new NotificationResponseDTO(saved.getId(), saved.getMessage(), saved.isSeen()));
	}

	private CarOwner getLoggedInOwner(HttpSession httpSession) {

		String email = (String) httpSession.getAttribute("carOwnerSession");
		if (email == null) throw new RuntimeException("not logged in please login and then try");
		return carOwnerRepository.findByEmail(email)
				.orElseThrow(() -> new InvalidEmailException("car owner email is incorrect"));
	}
}
