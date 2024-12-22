const Booking = require('../models/Booking');
const Flight = require('../models/Flight');

exports.createBooking = async (req, res) => {
  try {
    const { flight_id, seats } = req.body;
    const user_id = req.user.id;  // 인증 미들웨어에서 설정된 사용자 정보

    console.log('예약 요청 데이터:', { flight_id, seats, user_id });

    // 입력값 검증
    if (!flight_id || !seats) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    // 이미 예약한 항공편인지 확인
    const existingBooking = await Booking.checkExistingBooking(user_id, flight_id);
    if (existingBooking) {
      return res.status(400).json({ message: '이미 예약한 항공편입니다.' });
    }

    // 항공편 정보 조회
    const flight = await Flight.findById(flight_id);
    if (!flight) {
      return res.status(404).json({ message: '항공편을 찾을 수 없습니다.' });
    }

    // 좌석 수 확인
    if (flight.available_seats < seats) {
      return res.status(400).json({ message: '예약 가능한 좌석이 부족합니다.' });
    }

    // 총 가격 계산
    const total_price = flight.price * seats;

    console.log('예약 생성 데이터:', {
      user_id,
      flight_id,
      seats,
      total_price,
      status: 'confirmed'
    });

    // 예약 생성
    const bookingId = await Booking.create({
      user_id,
      flight_id,
      seats,
      total_price,
      status: 'confirmed'
    });

    // 항공편 좌석 수 업데이트
    await Flight.updateAvailableSeats(flight_id, seats);

    const booking = await Booking.findById(bookingId);
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error('예약 생성 중 에러:', error);
    console.error('에러 스택:', error.stack);
    if (error.code) console.error('에러 코드:', error.code);
    if (error.errno) console.error('에러 번호:', error.errno);
    if (error.sqlState) console.error('SQL 상태:', error.sqlState);
    if (error.sqlMessage) console.error('SQL 메시지:', error.sqlMessage);
    res.status(500).json({ message: '예약 생성 중 오류가 발생했습니다.', error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
    }

    // 본인의 예약인지 확인 (관리자는 모든 예약 조회 가능)
    if (booking.user_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: '예약 조회 중 오류가 발생했습니다.' });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findByUserId(req.user.id);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: '예약 목록 조회 중 오류가 발생했습니다.' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
    }

    // 본인의 예약인지 확인 (관리자는 모든 예약 취소 가능)
    if (booking.user_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }

    // 이미 취소된 예약인지 확인
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: '이미 취소된 예약입니다.' });
    }

    // 예약 상태 업데이트
    await Booking.updateStatus(req.params.id, 'cancelled');

    // 항공편 좌석 수 복구
    await Flight.updateAvailableSeats(booking.flight_id, -booking.seats);

    res.json({ message: '예약이 취소되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '예약 취소 중 오류가 발생했습니다.' });
  }
};

exports.getFlightBookings = async (req, res) => {
  try {
    // 관리자만 접근 가능
    if (!req.user.is_admin) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }

    const bookings = await Booking.findByFlightId(req.params.flightId);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: '항공편 예약 목록 조회 중 오류가 발생했습니다.' });
  }
}; 