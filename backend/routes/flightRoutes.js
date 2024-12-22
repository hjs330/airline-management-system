const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const { checkAuth, checkAdmin } = require('../middleware/authMiddleware');

// 공개 접근 가능한 라우트
router.get('/', flightController.getAllFlights);
router.get('/search', flightController.searchFlights);
router.get('/:id', flightController.getFlightById);

// 관리자 전용 라우트
router.post('/', checkAdmin, flightController.createFlight);
router.put('/:id', checkAdmin, flightController.updateFlight);
router.delete('/:id', checkAdmin, flightController.deleteFlight);

module.exports = router; 