const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

const pool = mysql.createPool(dbConfig);

// 연결 테스트
pool.getConnection()
  .then(connection => {
    console.log('데이터베이스 연결 성공');
    connection.release();
  })
  .catch(err => {
    console.error('데이터베이스 연결 실패:', err);
  });

module.exports = pool; 