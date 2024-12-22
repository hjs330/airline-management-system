require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// 미들웨어
app.use(cors());

/* aws설정
// CORS 설정
app.use(cors({
  origin: 'http://airline-frontend.s3-website.ap-northeast-2.amazonaws.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
*/

app.use(express.json());

// 라우터
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/flights', require('./routes/flightRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
}); 