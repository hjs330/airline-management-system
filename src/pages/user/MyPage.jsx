import { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, Button, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { ENDPOINTS } from '../../config/api';

function MyPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
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

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(ENDPOINTS.MY_BOOKINGS);
      console.log('API 응답 전체:', response);
      console.log('예약 데이터:', response.data);
      if (response.data && Array.isArray(response.data)) {
        console.log('개별 예약 데이터:', response.data[0]);
      }
      const bookingsData = Array.isArray(response.data) ? response.data : response.data.bookings;
      if (!Array.isArray(bookingsData)) {
        console.error('예약 데이터가 배열이 아닙니다:', bookingsData);
        setBookings([]);
        return;
      }
      setBookings(bookingsData);
    } catch (error) {
      console.error('예약 조회 실패:', error);
      setError('예약 내역을 불러오는데 실패했습니다.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('예약을 취소하시겠습니까?')) {
      return;
    }

    try {
      await api.put(ENDPOINTS.CANCEL_BOOKING(bookingId), {});
      fetchBookings();
      alert('예약이 취소되었습니다.');
    } catch (error) {
      console.error('예약 취소 실패:', error);
      alert(error.response?.data?.message || '예약 취소에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      fetchBookings();
    }
  }, [user]);

  if (!user) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">로그인이 필요합니다.</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          마이페이지
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            내 정보
          </Typography>
          <Typography>이메일: {user?.email}</Typography>
          <Typography>이름: {user?.name}</Typography>
          <Typography>역할: {user?.role === 'admin' ? '관리자' : '일반 사용자'}</Typography>
        </Paper>

        {user?.role !== 'admin' && (
          <>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              예약 내역
            </Typography>

            {loading && <CircularProgress />}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {bookings.length === 0 ? (
              <Paper sx={{ p: 3 }}>
                <Typography>예약 내역이 없습니다.</Typography>
              </Paper>
            ) : (
              <Grid container spacing={2}>
                {bookings.map((booking) => (
                  <Grid item xs={12} key={booking.id}>
                    <Paper sx={{ p: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={8}>
                          <Typography variant="h6">
                            {booking.departure} → {booking.destination}
                          </Typography>
                          <Typography>
                            출발: {new Date(booking.departure_time).toLocaleString()}
                          </Typography>
                          <Typography>
                            도착: {new Date(booking.arrival_time).toLocaleString()}
                          </Typography>
                          <Typography>항공편 번호: {booking.flight_number}</Typography>
                          <Typography>인원: {booking.seats}명</Typography>
                          <Typography>1인당 가격: {Number(booking.price).toLocaleString()}원</Typography>
                          <Typography>총 결제 금액: {Number(booking.total_price).toLocaleString()}원</Typography>
                          <Typography>상태: {booking.status === 'confirmed' ? '예약 완료' : '취소됨'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {booking.status === 'confirmed' && (
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={loading}
                              >
                                예약 취소
                              </Button>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>
    </Container>
  );
}

export default MyPage; 