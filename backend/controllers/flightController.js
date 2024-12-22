const Flight = require('../models/Flight');

exports.getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.findAll();
    console.log('조회된 항공편:', flights);  // 디버깅용 로그
    res.json(flights);
  } catch (error) {
    console.error('항공편 조회 에러:', error);
    res.status(500).json({ 
      message: '항공편 조회 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
};

exports.getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: '항공편을 찾을 수 없습니다.' });
    }
    res.json(flight);
  } catch (error) {
    console.error('항공편 조회 에러:', error);
    res.status(500).json({ 
      message: '항공편 조회 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
};

exports.searchFlights = async (req, res) => {
  try {
    const { 
      flight_number,
      departure, 
      destination, 
      departure_time,
      arrival_time,
      minPrice,
      maxPrice
    } = req.query;
    
    // 검색 조건이 없으면 전체 항공편 반환
    if (!flight_number && !departure && !destination && !departure_time && !arrival_time && !minPrice && !maxPrice) {
      const flights = await Flight.findAll();
      return res.json(flights);
    }

    const flights = await Flight.findByConditions({ 
      flight_number,
      departure, 
      destination, 
      departure_time,
      arrival_time,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined
    });
    res.json(flights);
  } catch (error) {
    console.error('항공편 검색 에러:', error);
    res.status(500).json({ 
      message: '항공편 검색 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
};

exports.createFlight = async (req, res) => {
  try {
    // 입력 데이터 검증
    const { flight_number, departure, destination, departure_time, arrival_time, price, available_seats } = req.body;
    
    if (!flight_number || !departure || !destination || !departure_time || !arrival_time || !price || !available_seats) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    // 데이터 형식 변환
    const flightData = {
      flight_number,
      departure,
      destination,
      departure_time: new Date(departure_time).toISOString(),
      arrival_time: new Date(arrival_time).toISOString(),
      price: Number(price),
      available_seats: Number(available_seats)
    };

    const flightId = await Flight.create(flightData);
    const newFlight = await Flight.findById(flightId);
    res.status(201).json(newFlight);
  } catch (error) {
    console.error('항공편 생성 에러:', error);
    res.status(500).json({ 
      message: '항공편 생성 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
};

exports.updateFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const { flight_number, departure, destination, departure_time, arrival_time, price, available_seats } = req.body;
    
    // 데이터 형식 변환
    const flightData = {
      flight_number,
      departure,
      destination,
      departure_time: new Date(departure_time).toISOString(),
      arrival_time: new Date(arrival_time).toISOString(),
      price: Number(price),
      available_seats: Number(available_seats)
    };

    const updated = await Flight.update(id, flightData);
    
    if (!updated) {
      return res.status(404).json({ message: '항공편을 찾을 수 없습니다.' });
    }

    // 업데이트된 항공편 정보를 반환
    const updatedFlight = await Flight.findById(id);
    res.json(updatedFlight);
  } catch (error) {
    console.error('항공편 수정 에러:', error);
    res.status(500).json({ 
      message: '항공편 수정 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
};

exports.deleteFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Flight.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ message: '항공편을 찾을 수 없습니다.' });
    }
    
    // 성공 응답에 삭제된 항공편의 ID를 포함
    res.json({ 
      success: true,
      message: '항공편이 삭제되었습니다.',
      id: id
    });
  } catch (error) {
    console.error('항공편 삭제 에러:', error);
    res.status(500).json({ 
      message: '항공편 삭제 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
};
  