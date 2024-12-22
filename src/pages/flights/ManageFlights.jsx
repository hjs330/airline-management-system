import { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Grid, TextField } from '@mui/material';
import axios from 'axios';
import { ENDPOINTS } from '../../config/api';

function ManageFlights() {
  const [flights, setFlights] = useState([]);
  const [flightNumber, setFlightNumber] = useState('');
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [price, setPrice] = useState('');
  const [availableSeats, setAvailableSeats] = useState('');
  const [editingFlightId, setEditingFlightId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // axios 인스턴스 설정
  const api = axios.create({
    baseURL: ENDPOINTS.API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  // 항공권 목록 로딩
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
    } catch (error) {
      console.error('항공권 조회 에러:', error);
      setError(error.response?.data?.message || '항공권 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
      
      // 가격 검색 - 정확한 값으로 검색
      if (price) {
        const numPrice = Number(price);
        searchParams.minPrice = numPrice;
        searchParams.maxPrice = numPrice;
      }

      fetchFlights(searchParams);
    } catch (error) {
      console.error('검색 처리 중 에러:', error);
      setError('검색 처리 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  // 검색 초기화 핸들러
  const handleResetSearch = () => {
    resetFields();
    // 초기화 후 즉시 검색 실행
    fetchFlights({});
  };

  // 항공권 추가 핸들러
  const handleAddFlight = async () => {
    try {
      setLoading(true);
      setError(null);

      // 입력값 검증
      if (!flightNumber || !departure || !destination || !departureTime || !arrivalTime || !price || !availableSeats) {
        setError('모든 필드를 입력해주세요.');
        return;
      }

      if (!window.confirm('이 항공권을 추가하시겠습니까?')) {
        return;
      }

      const flightData = {
        flight_number: flightNumber,
        departure,
        destination,
        departure_time: departureTime,
        arrival_time: arrivalTime,
        price: Number(price),
        available_seats: Number(availableSeats)
      };

      console.log('전송할 데이터:', flightData);

      const response = await api.post('/api/flights', flightData);

      console.log('항공권 추가 성공:', response.data);
      setFlights([...flights, response.data]);
      resetFields();
      alert('항공편이 추가되었습니다.');
    } catch (error) {
      console.error('항공권 추가 실패:', error);
      console.error('에러 응답:', error.response?.data);
      setError(error.response?.data?.message || '항공권 추가에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 항공권 수정 핸들러
  const handleUpdateFlight = async () => {
    try {
      setLoading(true);
      setError(null);

      // 입력값 검증
      if (!flightNumber || !departure || !destination || !departureTime || !arrivalTime || !price || !availableSeats) {
        setError('모든 필드를 입력해주세요.');
        return;
      }

      if (!window.confirm('이 항공권을 수정하시겠습니까?')) {
        return;
      }

      const flightData = {
        flight_number: flightNumber,
        departure,
        destination,
        departure_time: departureTime,
        arrival_time: arrivalTime,
        price: Number(price),
        available_seats: Number(availableSeats)
      };

      const response = await api.put(`/api/flights/${editingFlightId}`, flightData);

      console.log('항공권 수정 성공:', response.data);
      setFlights(flights.map(flight => (flight.id === editingFlightId ? response.data : flight)));
      resetFields();
      alert('항공편이 수정되었습니다.');
    } catch (error) {
      console.error('항공권 수정 실패:', error);
      console.error('에러 응답:', error.response?.data);
      setError(error.response?.data?.message || '항공권 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 항공권 삭제 핸들러
  const handleDeleteFlight = async (id) => {
    if (!window.confirm('이 항공권을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await api.delete(`/api/flights/${id}`);
      if (response.data.success) {
        setFlights(prevFlights => prevFlights.filter(flight => flight.id !== id));
        alert(response.data.message);
      }
    } catch (error) {
      console.error('항공권 삭제 중 에러:', error);
      alert(error.response?.data?.message || '항공권 삭제에 실패했습니다.');
    }
  };

  // 항공권 수정 핸들러
  const handleEditFlight = (flight) => {
    setEditingFlightId(flight.id);
    setFlightNumber(flight.flight_number);
    setDeparture(flight.departure);
    setDestination(flight.destination);
    setDepartureTime(new Date(flight.departure_time).toISOString().slice(0, 16));
    setArrivalTime(new Date(flight.arrival_time).toISOString().slice(0, 16));
    setPrice(flight.price);
    setAvailableSeats(flight.available_seats);
  };

  // 입력 필드 초기화 함수
  const resetFields = () => {
    setEditingFlightId(null);
    setFlightNumber('');
    setDeparture('');
    setDestination('');
    setDepartureTime('');
    setArrivalTime('');
    setPrice('');
    setAvailableSeats('');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          항공권 관리
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
              label="항공권 번호"
              variant="outlined"
              fullWidth
              margin="normal"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="출발지"
              variant="outlined"
              fullWidth
              margin="normal"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="목적지"
              variant="outlined"
              fullWidth
              margin="normal"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="출발 시간"
              variant="outlined"
              fullWidth
              margin="normal"
              type="datetime-local"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="도착 시간"
              variant="outlined"
              fullWidth
              margin="normal"
              type="datetime-local"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label={editingFlightId ? "가격" : "가격 검색"}
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              helperText={!editingFlightId && "입력한 가격과 정확히 일치하는 항공권을 검색합니다"}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="사용 가능한 좌석 수"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={availableSeats}
              onChange={(e) => setAvailableSeats(e.target.value)}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 4 }}>
          {editingFlightId ? (
            <>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleUpdateFlight}
                size="large"
                sx={{ mr: 1 }}
              >
                항공권 수정
              </Button>
              <Button 
                variant="outlined" 
                onClick={resetFields}
                size="large"
              >
                취소
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleAddFlight}
                size="large"
                sx={{ mr: 1 }}
              >
                항공권 추가
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleSearch}
                size="large"
                sx={{ mr: 1 }}
              >
                검색
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleResetSearch}
                size="large"
              >
                초기화
              </Button>
            </>
          )}
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
                <Typography variant="h6">항공편 번호: {flight.flight_number}</Typography>
                <Typography>출발지: {flight.departure}</Typography>
                <Typography>목적지: {flight.destination}</Typography>
                <Typography>출발 시간: {new Date(flight.departure_time).toLocaleString()}</Typography>
                <Typography>도착 시간: {new Date(flight.arrival_time).toLocaleString()}</Typography>
                <Typography variant="h6" color="primary">
                  가격: {flight.price.toLocaleString()}원
                </Typography>
                <Typography>사용 가능한 좌석 수: {flight.available_seats}</Typography>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={() => handleDeleteFlight(flight.id)} 
                  sx={{ mt: 1 }}
                >
                  삭제
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => handleEditFlight(flight)} 
                  sx={{ mt: 1, ml: 1 }}
                >
                  수정
                </Button>
              </Box>
            ))
          ) : (
            <Typography align="center" sx={{ mt: 4 }}>
              {error === '검색 결과 없습니다.' ? '검색 결과가 없습니다.' : '항공권이 없습니다.'}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default ManageFlights;
