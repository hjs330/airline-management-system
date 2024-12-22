// 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface Flight {
  id: string;
  flightNumber: string;
  departure: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
}

export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  bookingDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
} 