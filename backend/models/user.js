const pool = require('../lib/db');
const { v4: uuidv4 } = require('uuid');

class User {
  static async create(userData) {
    try {
      const { name, email, password, role = 'user' } = userData;
      const id = uuidv4();
      const query = 'INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)';
      
      const [result] = await pool.query(query, [id, email, password, name, role]);
      return result;
    } catch (error) {
      console.error('사용자 생성 에러:', error);
      throw new Error('사용자 생성 중 데이터베이스 오류가 발생했습니다.');
    }
  }

  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = ?';
      const [rows] = await pool.query(query, [email]);
      return rows[0];
    } catch (error) {
      console.error('이메일로 사용자 조회 에러:', error);
      throw new Error('사용자 조회 중 데이터베이스 오류가 발생했습니다.');
    }
  }

  static async findById(id) {
    try {
      const query = 'SELECT * FROM users WHERE id = ?';
      const [rows] = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      console.error('ID로 사용자 조회 에러:', error);
      throw new Error('사용자 조회 중 데이터베이스 오류가 발생했습니다.');
    }
  }
}

module.exports = User; 