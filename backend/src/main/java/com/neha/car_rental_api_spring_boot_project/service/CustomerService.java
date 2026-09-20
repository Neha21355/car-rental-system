package com.neha.car_rental_api_spring_boot_project.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.neha.car_rental_api_spring_boot_project.dto.CustomerRequestDTO;
import com.neha.car_rental_api_spring_boot_project.dto.CustomerResponseDTO;
import com.neha.car_rental_api_spring_boot_project.dto.CustomerProfileUpdateDTO;
import com.neha.car_rental_api_spring_boot_project.dto.NotificationResponseDTO;
import com.neha.car_rental_api_spring_boot_project.dto.LoginRequestDTO;
import com.neha.car_rental_api_spring_boot_project.entity.Customer;
import com.neha.car_rental_api_spring_boot_project.entity.Role;
import com.neha.car_rental_api_spring_boot_project.entity.Notification;
import com.neha.car_rental_api_spring_boot_project.exception.EmailAllreadyExistException;
import com.neha.car_rental_api_spring_boot_project.exception.InvalidEmailException;
import com.neha.car_rental_api_spring_boot_project.exception.InvalidPasswordException;
import com.neha.car_rental_api_spring_boot_project.mapper.CustomerMapper;
import com.neha.car_rental_api_spring_boot_project.repository.CustomerRepository;
import com.neha.car_rental_api_spring_boot_project.repository.RoleRepository;
import com.neha.car_rental_api_spring_boot_project.repository.NotificationRepository;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerService {

	private final CustomerRepository customerRepository;
	
	private final RoleRepository roleRepository;
	
	private final CustomerMapper customerMapper;
	
	private final PasswordEncoder passwordEncoder;

	private final NotificationRepository notificationRepository;
	
	public ResponseEntity<CustomerResponseDTO> registerCustomer(CustomerRequestDTO requestDTO){
		
		String email = requestDTO.getEmail().trim().toLowerCase();
		
		if(customerRepository.existsByEmail(email)) {
			throw new EmailAllreadyExistException("this username is already exist change your email and then register");
		}
		
		Role role=roleRepository.findByName("Role_Customer").orElseThrow(()->new RuntimeException("role is not found"));
		
		Customer customer=customerMapper.toCustomer(requestDTO);
		
		customer.setPassword(passwordEncoder.encode(requestDTO.getPassword()));
		
		customer.setRoles(List.of(role));
		
		Customer savedCustomer=customerRepository.save(customer);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(customerMapper.toCustomerResponseDTO(savedCustomer));
	}
	
	public ResponseEntity<String> loginCustomer(LoginRequestDTO requestDTO,HttpSession httpSession){
		
		String email = requestDTO.getEmail().trim().toLowerCase();
		
		Customer customer=customerRepository.findByEmail(email).orElseThrow(()->new InvalidEmailException("customer email is incorrect"));
	
		if (!passwordEncoder.matches(requestDTO.getPassword(), customer.getPassword())) {
			throw new InvalidPasswordException("invalid password");
		}
		
		httpSession.removeAttribute("carOwnerSession");
		httpSession.setAttribute("customerSession", customer.getEmail());
		
		return ResponseEntity.status(HttpStatus.ACCEPTED).body("customer login successfully");
	}

	public ResponseEntity<CustomerResponseDTO> getProfile(HttpSession httpSession) {
		return ResponseEntity.ok(customerMapper.toCustomerResponseDTO(getLoggedInCustomer(httpSession)));
	}

	public ResponseEntity<CustomerResponseDTO> updateProfile(CustomerProfileUpdateDTO dto, HttpSession httpSession) {
		Customer customer = getLoggedInCustomer(httpSession);
		customer.setName(dto.getName());
		customer.setEmail(dto.getEmail().trim().toLowerCase());
		customer.setPhoneNumber(dto.getPhoneNumber());
		customer.setAddress(dto.getAddress());
		Customer saved = customerRepository.save(customer);
		httpSession.setAttribute("customerSession", saved.getEmail());
		return ResponseEntity.ok(customerMapper.toCustomerResponseDTO(saved));
	}

	public ResponseEntity<List<NotificationResponseDTO>> getNotifications(HttpSession httpSession) {
		Customer customer = getLoggedInCustomer(httpSession);
		List<NotificationResponseDTO> notifications = notificationRepository.findAllByCustomerOrderByIdDesc(customer)
				.stream().map(this::toNotificationDTO).toList();
		return ResponseEntity.ok(notifications);
	}

	public ResponseEntity<NotificationResponseDTO> markNotificationSeen(Long notificationId, HttpSession httpSession) {
		Customer customer = getLoggedInCustomer(httpSession);
		Notification notification = notificationRepository.findById(notificationId)
				.orElseThrow(() -> new RuntimeException("notification not found"));
		if (notification.getCustomer() == null || !notification.getCustomer().getId().equals(customer.getId())) {
			throw new RuntimeException("notification does not belong to customer");
		}
		notification.setSeen(true);
		return ResponseEntity.ok(toNotificationDTO(notificationRepository.save(notification)));
	}

	private Customer getLoggedInCustomer(HttpSession httpSession) {
		String email = (String) httpSession.getAttribute("customerSession");
		if (email == null) throw new RuntimeException("not logged in please login and then try");
		return customerRepository.findByEmail(email)
				.orElseThrow(() -> new InvalidEmailException("customer email is incorrect"));
	}

	private NotificationResponseDTO toNotificationDTO(Notification notification) {
		return new NotificationResponseDTO(notification.getId(), notification.getMessage(), notification.isSeen());
	}
}
