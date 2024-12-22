import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          항공권 관리 시스템
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
          편리한 항공권 예약 및 관리 서비스
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            component={Link}
            to="/flights"
            variant="contained"
            size="large"
            sx={{ mr: 2 }}
          >
            항공권 조회
          </Button>
          <Button
            component={Link}
            to="/register"
            variant="outlined"
            size="large"
          >
            회원가입
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Home; 