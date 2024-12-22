const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { checkAuth, checkAdmin } = require('../middleware/authMiddleware');

// 인증된 사용자만 접근 가능한 라우트
router.use(checkAuth);

// 예약 생성
router.post('/', bookingController.createBooking);

// 사용자의 예약 목록 조회
router.get('/my-bookings', bookingController.getUserBookings);

// 특정 예약 조회
router.get('/:id', bookingController.getBookingById);

// 예약 취소
router.put('/:id/cancel', bookingController.cancelBooking);

// 관리자 전용 라우트
router.get('/flight/:flightId', checkAdmin, bookingController.getFlightBookings);

module.exports = router; 