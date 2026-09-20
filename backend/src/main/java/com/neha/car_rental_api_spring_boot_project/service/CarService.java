package com.neha.car_rental_api_spring_boot_project.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.neha.car_rental_api_spring_boot_project.dto.CarRequestDTO;
import com.neha.car_rental_api_spring_boot_project.dto.CarResponseDTO;
import com.neha.car_rental_api_spring_boot_project.entity.Car;
import com.neha.car_rental_api_spring_boot_project.entity.CarOwner;
import com.neha.car_rental_api_spring_boot_project.enums.CarStatus;
import com.neha.car_rental_api_spring_boot_project.exception.InvalidEmailException;
import com.neha.car_rental_api_spring_boot_project.mapper.CarMapper;
import com.neha.car_rental_api_spring_boot_project.repository.CarOwnerRepository;
import com.neha.car_rental_api_spring_boot_project.repository.CarRepository;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CarService {

	private final CarRepository carRepository;

	private final CarMapper carMapper;

	private final CarOwnerRepository ownerRepository;

	public ResponseEntity<CarResponseDTO> registerCarService(CarRequestDTO carRequestDTO, HttpSession httpSession) {

		String email = (String) httpSession.getAttribute("carOwnerSession");

		if (email == null) {

			throw new RuntimeException("not logged in please login and then try");
		}

		CarOwner carOwner = ownerRepository.findByEmail(email)
				.orElseThrow(() -> new InvalidEmailException("email is invalid"));

		// converting carRequest to Car
		Car car = carMapper.toCar(carRequestDTO);

		// this will save foriegn key in car table
		car.setCarOwner(carOwner);

		Car savedCar = carRepository.save(car);

		// converting car to carResponseDTO
		CarResponseDTO carResponseDTO = carMapper.toCarResponseDTO(savedCar);

		return ResponseEntity.status(HttpStatus.CREATED).body(carResponseDTO);

	}

	public ResponseEntity<List<CarResponseDTO>> getAllCarsService() {

		List<Car> cars = carRepository.findAll();

		return ResponseEntity.status(HttpStatus.OK).body(carMapper.toCarResponseDTOList(cars));
	}

	public ResponseEntity<List<CarResponseDTO>> getAllCarsForOwnerService(HttpSession httpSession) {

		CarOwner carOwner = getLoggedInOwner(httpSession);
		return ResponseEntity.ok(carMapper.toCarResponseDTOList(carOwner.getCars()));
	}

	public ResponseEntity<CarResponseDTO> updateCarService(Long carId, CarRequestDTO carRequestDTO,
			HttpSession httpSession) {

		CarOwner carOwner = getLoggedInOwner(httpSession);
		Car car = getOwnedCar(carId, carOwner);
		Car updatedCar = carMapper.toCar(carRequestDTO);
		updatedCar.setId(car.getId());
		updatedCar.setCarOwner(carOwner);
		updatedCar.setCarStatus(car.getCarStatus());

		Car savedCar = carRepository.save(updatedCar);
		return ResponseEntity.ok(carMapper.toCarResponseDTO(savedCar));
	}

	public ResponseEntity<?> deleteCarService(Long carId, HttpSession httpSession) {

		CarOwner carOwner = getLoggedInOwner(httpSession);
		Car car = getOwnedCar(carId, carOwner);
		if (car.getCarStatus() != CarStatus.AVAILABLE) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body("Only available cars can be deleted");
		}

		carRepository.delete(car);
		return ResponseEntity.ok("car deleted successfully");
	}

	private CarOwner getLoggedInOwner(HttpSession httpSession) {

		String email = (String) httpSession.getAttribute("carOwnerSession");
		if (email == null) {
			throw new RuntimeException("not logged in please login and then try");
		}
		return ownerRepository.findByEmail(email)
				.orElseThrow(() -> new InvalidEmailException("email is invalid"));
	}

	private Car getOwnedCar(Long carId, CarOwner carOwner) {

		Car car = carRepository.findById(carId)
				.orElseThrow(() -> new RuntimeException("Car with id " + carId + " not found"));
		if (car.getCarOwner() == null || !car.getCarOwner().getId().equals(carOwner.getId())) {
			throw new RuntimeException("you can only manage your own cars");
		}
		return car;
	}

	/**
	 * This method retrieves a car by its ID and returns a ResponseEntity containing
	 * the corresponding CarResponseDTO.
	 * 
	 * @param carId
	 * @return ResponseEntity<CarResponseDTO> with the car details if found, or
	 *         throws a RuntimeException if not found.
	 */
	public Car getCarByIdService(Long carId) {

		return carRepository.findById(carId)
				.orElseThrow(() -> new RuntimeException("Car with id " + carId + " not found"));

	}
}
