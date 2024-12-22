import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Airline
        </Typography>
        <Box>
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/flights">
                항공권 조회
              </Button>
              <Button color="inherit" component={Link} to="/mypage">
                마이페이지
              </Button>
              <Button color="inherit" onClick={handleLogout}>
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
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 