const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dbConfig = require('../config/database');

async function createAdmin() {
  const pool = mysql.createPool(dbConfig);
  const email = 'admin@admin.com'; // admin 이메일
  const password = 'admin'; // admin 비밀번호
  const hashedPassword = await bcrypt.hash(password, 12); // 비밀번호 해시화

  const query = `
    INSERT INTO users (id, email, password, name, role)
    VALUES (UUID(), ?, ?, ?, 'admin')
  `;

  try {
    const [result] = await pool.execute(query, [email, hashedPassword, 'admin']);
    console.log('Admin 계정이 생성되었습니다:', result);
  } catch (error) {
    console.error('Admin 계정 생성 중 에러:', error);
  } finally {
    await pool.end();
  }
}

createAdmin(); 