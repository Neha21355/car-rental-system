# CarRent Frontend ↔ Spring Boot Backend (Connected)

## Config
- Backend: `http://localhost:1571`
- MySQL: `car_rental_Niwash` / user `root` / password `root`
- Frontend: `http://localhost:3000` (Vite proxies `/api` → `:1571`)

## Setup MySQL
```sql
CREATE DATABASE IF NOT EXISTS car_rental_Niwash;
-- After first backend start (tables created), insert roles:
INSERT INTO role (name) VALUES ('Role_Customer');
INSERT INTO role (name) VALUES ('Role_CarOwner');
```
(Table name may be `roles` — check after Hibernate creates schema.)

## Run Backend
```bash
cd car-rental-api-backend-spring-boot-main
./mvnw spring-boot:run
```

## Run Frontend
```bash
cd car-rental-frontend
npm install
npm run dev
```

## Connected APIs
| Action | Method | Path |
|--------|--------|------|
| Register | POST | /api/v1/auth/registerCustomer |
| Login Customer | POST | /api/v1/auth/loginCustomer |
| Login Owner | POST | /api/v1/auth/loginCarOwner |
| List Cars | GET | /api/v1/customer/getAllCars |
| Book Car | POST | /api/v1/customer/bookCar/{carId} |
| Register Car | POST | /api/v1/carOwner/registerCar |

Session cookies + CORS enabled for localhost:3000.
