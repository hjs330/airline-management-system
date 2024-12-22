const pool = require('../lib/db');

class Booking {
  static async create(bookingData) {
    let connection;
    try {
      connection = await pool.getConnection();
      console.log('데이터베이스 연결 성공');

      const { user_id, flight_id, seats, total_price, status = 'confirmed' } = bookingData;
      
      console.log('예약 생성 시도:', bookingData);

      // UUID 생성
      const [uuidResult] = await connection.query('SELECT UUID() as uuid');
      const bookingId = uuidResult[0].uuid;

      const query = `
        INSERT INTO bookings 
        (id, user_id, flight_id, seats, total_price, status, booking_date) 
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `;
      const values = [bookingId, user_id, flight_id, seats, total_price, status];
      
      console.log('실행할 SQL 쿼리:', query);
      console.log('바인딩할 값들:', values);
      
      await connection.query(query, values);
      console.log('예약이 성공적으로 생성되었습니다. ID:', bookingId);

      return bookingId;  // UUID 반환
    } catch (error) {
      console.error('예약 생성 중 에러:', error);
      console.error('에러 스택:', error.stack);
      if (error.code) console.error('에러 코드:', error.code);
      if (error.errno) console.error('에러 번호:', error.errno);
      if (error.sqlState) console.error('SQL 상태:', error.sqlState);
      if (error.sqlMessage) console.error('SQL 메시지:', error.sqlMessage);
      throw error;
    } finally {
      if (connection) {
        connection.release();
        console.log('데이터베이스 연결 해제');
      }
    }
  }

  static async findById(id) {
    const query = `
      SELECT b.*, f.flight_number, f.departure, f.destination, 
             f.departure_time, f.arrival_time, f.price
      FROM bookings b
      JOIN flights f ON b.flight_id = f.id
      WHERE b.id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async findByUserId(userId) {
    const query = `
      SELECT b.*, f.flight_number, f.departure, f.destination, 
             f.departure_time, f.arrival_time, f.price
      FROM bookings b
      JOIN flights f ON b.flight_id = f.id
      WHERE b.user_id = ?
      ORDER BY b.booking_date DESC
    `;
    const [rows] = await pool.query(query, [userId]);
    return rows;
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE bookings SET status = ? WHERE id = ?';
    const [result] = await pool.query(query, [status, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const query = 'DELETE FROM bookings WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }

  static async findByFlightId(flightId) {
    const query = `
      SELECT b.*, u.username 
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE b.flight_id = ?
      ORDER BY b.booking_date DESC
    `;
    const [rows] = await pool.query(query, [flightId]);
    return rows;
  }

  static async checkExistingBooking(userId, flightId) {
    const query = `
      SELECT COUNT(*) as count 
      FROM bookings 
      WHERE user_id = ? AND flight_id = ? AND status != 'cancelled'
    `;
    const [[result]] = await pool.query(query, [userId, flightId]);
    return result.count > 0;
  }
}

module.exports = Booking; 