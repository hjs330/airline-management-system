import { Container, Typography, Box } from '@mui/material';

function UserDashboard() {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          사용자 대시보드
        </Typography>
        {/* 사용자 대시보드 내용을 여기에 표시할 수 있습니다. */}
      </Box>
    </Container>
  );
}

export default UserDashboard; 