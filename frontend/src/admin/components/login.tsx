import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  InputAdornment, 
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import '../styles/loginPage.css';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer(prev => prev - 1);
      }, 1000);
    } else if (isLocked && lockTimer === 0) {
      setIsLocked(false);
    }
    
    return () => clearInterval(interval);
  }, [isLocked, lockTimer]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Calculate distance from center (max 20px movement)
      const deltaX = (clientX - centerX) / centerX * 10;
      const deltaY = (clientY - centerY) / centerY * 10;
      
      setLogoPosition({ x: deltaX, y: deltaY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) return;
    
    if (username === 'admin' && password === 'admin') {
      // Redirect to dashboard or set auth state
      window.location.href = '/admin/dashboard';
    } else {
      setError('Invalid username or password');
      setLoginAttempts(prev => prev + 1);
      
      if (loginAttempts + 1 >= 3) {
        setIsLocked(true);
        setLockTimer(30); // Lock for 30 seconds
      }
    }
  };

  const handleCloseAlert = () => {
    setError('');
  };
  
  return (
    <Box className="admin-login-page">
      <Container maxWidth="sm" className="login-container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper 
            elevation={8}
            className="login-paper"
          >
            <Box className="login-header">
              <motion.div
                animate={{
                  x: logoPosition.x,
                  y: logoPosition.y,
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{ 
                  rotate: { repeat: Infinity, duration: 10 },
                  x: { type: "spring", stiffness: 50 },
                  y: { type: "spring", stiffness: 50 }
                }}
                className="logo-container"
              >
                <SportsBasketballIcon className="logo-icon basketball" />
                <SportsSoccerIcon className="logo-icon soccer" />
              </motion.div>
              <Typography variant="h4" className="login-title">
                StopShot Admin
              </Typography>
              <Typography variant="subtitle1" className="login-subtitle">
                Game Day Management
              </Typography>
            </Box>

            <Box 
              component="form" 
              onSubmit={handleLogin}
              className="login-form"
            >
              <TextField
                required
                fullWidth
                label="Username"
                variant="outlined"
                className="login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon className="input-icon" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                required
                fullWidth
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon className="input-icon" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        className="visibility-toggle"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              {isLocked ? (
                <Box className="locked-message">
                  <Typography variant="body2">
                    Too many failed attempts. Please try again in {lockTimer} seconds
                  </Typography>
                </Box>
              ) : (
                <Button 
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="login-button"
                  disabled={isLocked}
                >
                  Sign In
                </Button>
              )}
              
              <Typography variant="caption" className="login-hint">
                Default credentials: admin / admin
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert severity="error" onClose={handleCloseAlert}>
          {error}
        </Alert>
      </Snackbar>
      
      {/* Background elements */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div 
          key={i}
          className="bg-element"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${10 + Math.random() * 20}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </Box>
  );
};

export default AdminLogin;