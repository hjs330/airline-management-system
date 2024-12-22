export const ENDPOINTS = {
  API_BASE_URL: 'http://localhost:3000',
  
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/signup',
  LOGOUT: '/api/auth/logout',
  
  // Flights
  FLIGHTS: '/api/flights',
  SEARCH_FLIGHTS: '/api/flights/search',
  FLIGHT_DETAIL: (id) => `/api/flights/${id}`,
  UPDATE_FLIGHT: (id) => `/api/flights/${id}`,
  DELETE_FLIGHT: (id) => `/api/flights/${id}`,
  
  // Bookings
  BOOKINGS: '/api/bookings',
  MY_BOOKINGS: '/api/bookings/my-bookings',
  BOOKING_DETAIL: (id) => `/api/bookings/${id}`,
  CANCEL_BOOKING: (id) => `/api/bookings/${id}/cancel`,
  
  // Users
  USERS: '/api/users',
  USER_DETAIL: (id) => `/api/users/${id}`,
  UPDATE_USER: (id) => `/api/users/${id}`,
  DELETE_USER: (id) => `/api/users/${id}`,
}; 