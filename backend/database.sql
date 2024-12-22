-- users 테이블 삭제 및 재생성
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user'
);

-- flights 테이블 삭제 및 재생성
DROP TABLE IF EXISTS flights;
CREATE TABLE flights (
    id VARCHAR(36) PRIMARY KEY,
    flight_number VARCHAR(10) NOT NULL,
    departure VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    price DECIMAL(10, 0) NOT NULL,
    available_seats INT NOT NULL
);

-- bookings 테이블 삭제 및 재생성
DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    flight_id VARCHAR(36) NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('confirmed', 'cancelled', 'pending') DEFAULT 'confirmed',
    seats INT NOT NULL DEFAULT 1,
    total_price INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (flight_id) REFERENCES flights(id)
); 

-- flights 테이블 테스트 데이터 추가
INSERT INTO flights (id, flight_number, departure, destination, departure_time, arrival_time, price, available_seats) 
VALUES 
('1', 'KE001', '서울', '제주', '2024-03-20 10:00:00', '2024-03-20 11:10:00', 150000, 120),
('2', 'KE002', '부산', '서울', '2024-03-20 12:00:00', '2024-03-20 13:00:00', 130000, 100),
('3', 'KE003', '제주', '서울', '2024-03-20 14:00:00', '2024-03-20 15:10:00', 160000, 150);