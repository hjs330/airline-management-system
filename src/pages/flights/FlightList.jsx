import { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, TextField, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { ENDPOINTS } from '../../config/api';

function FlightList() {
  const { user } = useAuth();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [flightNumber, setFlightNumber] = useState('');
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [selectedSeatsMap, setSelectedSeatsMap] = useState({});

  // axios 인스턴스 설정
  const api = axios.create({
    baseURL: ENDPOINTS.API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  // 항공권 목록 조회 함수
  const fetchFlights = async (searchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      
      // 검색 파라미터 처리
      if (searchParams.flight_number) params.append('flight_number', searchParams.flight_number);
      if (searchParams.departure) params.append('departure', searchParams.departure);
      if (searchParams.destination) params.append('destination', searchParams.destination);
      if (searchParams.departure_time) params.append('departure_time', searchParams.departure_time);
      if (searchParams.arrival_time) params.append('arrival_time', searchParams.arrival_time);
      if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice);
      if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice);

      const response = await api.get(`/api/flights/search?${params.toString()}`);
      setFlights(response.data);
      
      if (response.data.length === 0 && Object.keys(searchParams).length > 0) {
        setError('검색 결과가 없습니다.');
      }
    } catch (error) {
      console.error('항공권 조회 에러:', error);
      setError(error.response?.data?.message || '항공권 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    fetchFlights();
  }, []);

  // 검색 핸들러
  const handleSearch = () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = {};
    
      // 항공편 번호는 정확한 값으로 검색
      if (flightNumber) searchParams.flight_number = flightNumber;
      
      // 출발지와 목적지는 부분 일치 검색
      if (departure) searchParams.departure = departure;
      if (destination) searchParams.destination = destination;
      
      // 날짜 검색
      if (departureTime) {
        searchParams.departure_time = departureTime;
      }
      if (arrivalTime) {
        searchParams.arrival_time = arrivalTime;
      }
      
      // 가격 범위 검색 - 정확한 값으로 검색
      if (minPrice) searchParams.minPrice = Number(minPrice);
      if (maxPrice) searchParams.maxPrice = Number(maxPrice);

      fetchFlights(searchParams);
    } catch (error) {
      console.error('검색 처리 중 에러:', error);
      setError('검색 처리 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  // 검색 초기화
  const handleReset = () => {
    setFlightNumber('');
    setDeparture('');
    setDestination('');
    setMinPrice('');
    setMaxPrice('');
    setDepartureTime('');
    setArrivalTime('');
    fetchFlights({});
  };

  // 예석 수 변경 핸들러
  const handleSeatsChange = (flightId, value) => {
    setSelectedSeatsMap(prev => ({
      ...prev,
      [flightId]: value
    }));
  };

  // 예약 핸들러
  const handleBooking = async (flightId, price) => {
    if (!user) {
      alert('예약하려면 로그인이 필요합니다.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const selectedSeats = selectedSeatsMap[flightId] || 1;

      const bookingData = {
        flight_id: flightId,
        seats: selectedSeats,
        total_price: price * selectedSeats
      };

      console.log('예약 요청 데이터:', bookingData);

      const response = await api.post('/api/bookings', bookingData);

      if (response.data.success) {
        alert('예약이 완료되었습니다.');
        setSelectedSeatsMap(prev => ({
          ...prev,
          [flightId]: 1
        }));
        await fetchFlights();
      } else {
        alert(response.data.message || '예약에 실패했습니다.');
      }
    } catch (error) {
      console.error('예약 실패:', error);
      const errorMessage = error.response?.data?.message || '예약 처리 중 오류가 발생했습니다.';
      console.error('에러 메시지:', errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          항공권 조회
        </Typography>
        
        {error && error !== '검색 결과가 없습니다.' && (
          <Box sx={{ mb: 2, p: 2, bgcolor: '#ffebee', borderRadius: 1 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {loading && (
          <Box sx={{ mb: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
            <Typography>처리 중...</Typography>
          </Box>
        )}
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="항공권 번호 조회"
              variant="outlined"
              fullWidth
              margin="normal"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="출발지 조회"
              variant="outlined"
              fullWidth
              margin="normal"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="목적지 조회"
              variant="outlined"
              fullWidth
              margin="normal"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="출발 시간부터"
              type="datetime-local"
              variant="outlined"
              fullWidth
              margin="normal"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="도착 시간까지"
              type="datetime-local"
              variant="outlined"
              fullWidth
              margin="normal"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="최소 가격 조회"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="최대 가격 조회"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSearch}
            size="large"
            sx={{ mr: 1 }}
          >
            항공권 검색
          </Button>
          <Button 
            variant="outlined"
            onClick={handleReset}
            size="large"
          >
            초기화
          </Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          {flights.length > 0 ? (
            flights.map(flight => (
              <Box 
                key={flight.id} 
                sx={{ 
                  border: '1px solid #ccc', 
                  borderRadius: '4px', 
                  p: 3,
                  mb: 2,
                  maxWidth: 800,
                  mx: 'auto',
                  backgroundColor: '#fff',
                  boxShadow: 1
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6">항공편 번호: {flight.flight_number}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>출발지: {flight.departure}</Typography>
                    <Typography>출발 시간: {new Date(flight.departure_time).toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>목적지: {flight.destination}</Typography>
                    <Typography>도착 시간: {new Date(flight.arrival_time).toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" color="primary">
                      가격: {flight.price.toLocaleString()}원
                    </Typography>
                    <Typography>
                      잔여 좌석: {flight.available_seats}석
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Button 
                        component={Link} 
                        to={`/flights/${flight.id}`} 
                        variant="outlined"
                        sx={{ mt: 1 }}
                      >
                        상세 보기
                      </Button>
                      {user && user.role === 'user' && (
                        <>
                          <TextField
                            label="예약 좌석 수"
                            type="number"
                            size="small"
                            value={selectedSeatsMap[flight.id] || 1}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (value > 0 && value <= flight.available_seats) {
                                handleSeatsChange(flight.id, value);
                              }
                            }}
                            inputProps={{
                              min: 1,
                              max: flight.available_seats
                            }}
                            sx={{ width: 120, mt: 1 }}
                          />
                          <Button 
                            variant="contained" 
                            color="primary"
                            onClick={() => handleBooking(flight.id, flight.price)}
                            disabled={flight.available_seats <= 0}
                            sx={{ mt: 1 }}
                          >
                            {flight.available_seats <= 0 ? '매진' : '예약하기'}
                          </Button>
                        </>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))
          ) : (
            <Typography align="center" sx={{ mt: 4 }}>
              {error === '검색 결과가 없습니다.' ? '검색 결과가 없습니다.' : '항공권이 없습니다.'}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default FlightList; 