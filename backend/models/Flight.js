const pool = require('../lib/db');
const { v4: uuidv4 } = require('uuid');

class Flight {
  static async findAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM flights ORDER BY departure_time');
      return rows;
    } catch (error) {
      console.error('항공편 조회 에러:', error);
      throw new Error('항공편 조회 중 데이터베이스 오류가 발생했습니다.');
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM flights WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('항공편 조회 에러:', error);
      throw new Error('항공편 조회 중 데이터베이스 오류가 발생했습니다.');
    }
  }

  static async findByConditions(conditions) {
    try {
      let query = 'SELECT * FROM flights WHERE 1=1';
      const values = [];

      console.log('검색 조건:', conditions);

      if (conditions.flight_number) {
        query += ' AND flight_number = ?';
        values.push(conditions.flight_number);
      }

      if (conditions.departure) {
        query += ' AND departure LIKE ?';
        values.push(`%${conditions.departure}%`);
      }

      if (conditions.destination) {
        query += ' AND destination LIKE ?';
        values.push(`%${conditions.destination}%`);
      }

      if (conditions.departure_time) {
        const date = new Date(conditions.departure_time);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        query += ' AND DATE(departure_time) = ?';
        values.push(formattedDate);
      }

      if (conditions.arrival_time) {
        const date = new Date(conditions.arrival_time);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        query += ' AND DATE(arrival_time) = ?';
        values.push(formattedDate);
      }

      if (conditions.minPrice !== undefined) {
        query += ' AND price >= ?';
        values.push(conditions.minPrice);
      }

      if (conditions.maxPrice !== undefined) {
        query += ' AND price <= ?';
        values.push(conditions.maxPrice);
      }

      query += ' ORDER BY departure_time';
      
      console.log('실행할 SQL 쿼리:', query);
      console.log('바인딩할 값들:', values);
      
      const [rows] = await pool.query(query, values);
      console.log('검색 결과:', rows);
      return rows;
    } catch (error) {
      console.error('항공편 검색 에러:', error);
      throw new Error('항공편 검색 중 데이터베이스 오류가 발생했습니다.');
    }
  }

  static async create(flightData) {
    let connection;
    try {
      // 데이터베이스 연결 확인
      connection = await pool.getConnection();
      console.log('데이터베이스 연결 성공');

      const { flight_number, departure, destination, departure_time, arrival_time, price, available_seats } = flightData;
      
      // MySQL datetime 형식으로 변환
      const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toISOString().slice(0, 19).replace('T', ' ');
      };

      const query = `
        INSERT INTO flights 
        (id, flight_number, departure, destination, departure_time, arrival_time, price, available_seats) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const id = uuidv4();
      const values = [
        id,
        flight_number,
        departure,
        destination,
        formatDateTime(departure_time),
        formatDateTime(arrival_time),
        price,
        available_seats
      ];
      
      const [result] = await connection.query(query, values);
      return id;
    } catch (error) {
      console.error('항공편 생성 에러:', error);
      console.error('에러 스택:', error.stack);
      if (error.code) console.error('에러 코드:', error.code);
      if (error.errno) console.error('에러 번호:', error.errno);
      if (error.sqlState) console.error('SQL 상태:', error.sqlState);
      if (error.sqlMessage) console.error('SQL 메시지:', error.sqlMessage);
      throw new Error('항공편 생성 중 데이터베이스 오류가 발생했습니다.');
    } finally {
      if (connection) {
        connection.release();
        console.log('데이터베이스 연결 해제');
      }
    }
  }

  static async update(id, flightData) {
    try {
      const { flight_number, departure, destination, departure_time, arrival_time, price, available_seats } = flightData;
      
      // MySQL datetime 형식으로 변환
      const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toISOString().slice(0, 19).replace('T', ' ');
      };

      const query = `
        UPDATE flights 
        SET flight_number = ?, 
            departure = ?, 
            destination = ?, 
            departure_time = ?, 
            arrival_time = ?, 
            price = ?, 
            available_seats = ?
        WHERE id = ?
      `;
      const values = [
        flight_number,
        departure,
        destination,
        formatDateTime(departure_time),
        formatDateTime(arrival_time),
        price,
        available_seats,
        id
      ];
      
      const [result] = await pool.query(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('항공편 수정 에러:', error);
      throw new Error('항공편 수정 중 데이터베이스 오류가 발생했습니다.');
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM flights WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('항공편 삭제 에러:', error);
      throw new Error('항공편 삭제 중 데이터베이스 오류가 발생했습니다.');
    }
  }

  static async updateAvailableSeats(id, seatCount) {
    try {
      const query = `
        UPDATE flights 
        SET available_seats = available_seats - ? 
        WHERE id = ? AND available_seats >= ?
      `;
      const [result] = await pool.query(query, [seatCount, id, seatCount]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('좌석 수 업데이트 에러:', error);
      throw new Error('좌석 수 업데이트 중 데이터베이스 오류가 발생했습니다.');
    }
  }
}

module.exports = Flight; 