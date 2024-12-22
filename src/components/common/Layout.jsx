import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            항공권 예약 시스템
          </Typography>
          <Button color="inherit" component={Link} to="/flights">
            항공권 조회
          </Button>
          {user && user.role === 'admin' && (
            <Button color="inherit" component={Link} to="/manage-flights">
              항공권 관리
            </Button>
          )}
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/mypage">
                마이페이지
              </Button>
              <Button color="inherit" onClick={logout}>
                로그아웃
              </Button>
              <Typography variant="subtitle1" component="span" sx={{ ml: 2 }}>
                {user.name}님
              </Typography>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                로그인
              </Button>
              <Button color="inherit" component={Link} to="/register">
                회원가입
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container>
        <Box py={3}>
          {children}
        </Box>
      </Container>
    </>
  );
}

export default Layout; 