import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import FlightList from './pages/flights/FlightList';
import FlightDetail from './pages/flights/FlightDetail';
import AdminDashboard from './pages/admin/Dashboard';
import UserDashboard from './pages/user/Dashboard';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import MyPage from './pages/user/MyPage';
import ManageFlights from './pages/flights/ManageFlights';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/flights" element={<FlightList />} />
              <Route 
                path="/manage-flights" 
                element={
                  <AdminRoute>
                    <ManageFlights />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/flights/:id" 
                element={<FlightDetail />} 
              />
              <Route 
                path="/admin/*" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route 
                path="/mypage" 
                element={
                  <PrivateRoute>
                    <MyPage />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
