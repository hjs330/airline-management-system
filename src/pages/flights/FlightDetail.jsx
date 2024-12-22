import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, CircularProgress, Alert, Grid } from '@mui/material';
import axios from 'axios';
import { ENDPOINTS } from '../../config/api';

function FlightDetail() {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // axios 인스턴스 설정
  const api = axios.create({
    baseURL: ENDPOINTS.API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/flights/${id}`);
        setFlight(response.data);
      } catch (error) {
        console.error('항공편 조회 실패:', error);
        setError(error.response?.data?.message || '항공편 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!flight) return <div>항공권을 찾을 수 없습니다.</div>;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          항공권 상세 정보
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                항공편 번호: {flight.flight_number}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                출발지: {flight.departure}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                목적지: {flight.destination}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                출발 시간: {new Date(flight.departure_time).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                도착 시간: {new Date(flight.arrival_time).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                가격: {flight.price.toLocaleString()}원
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                잔여 좌석: {flight.available_seats}석
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
}

export default FlightDetail; 