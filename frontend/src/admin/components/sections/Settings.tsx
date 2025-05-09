import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';

interface SettingsProps {
  darkMode: boolean;
  onDarkModeChange: (darkMode: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ darkMode, onDarkModeChange }) => {
  const { authToken } = useAuth();
  const theme = useTheme();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    role: ''
  });
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Create axios instance with auth header
        const axiosInstance = axios.create({
          baseURL: 'http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api',
          headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Get user profile
        const response = await axiosInstance.get('/auth/profile/');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    if (authToken) {
      fetchUserData();
    }
  }, [authToken]);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    
    try {
      const axiosInstance = axios.create({
        baseURL: 'http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      await axiosInstance.post('/auth/change-password/', {
        current_password: currentPassword,
        new_password: newPassword
      });
      
      // Reset form and close dialog
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      setChangePasswordOpen(false);
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('Failed to change password. Please check your current password.');
    }
  };

  const handleCloseDialog = () => {
    setChangePasswordOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  // Set text color based on mode
  const textColor = darkMode ? '#fff' : '#333';
  const descriptionColor = darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)';

  return (
    <>
      <Box className="content-paper" sx={{ color: textColor }}>
        <Typography variant="h6" className="settings-title" sx={{ color: textColor }}>
          User Preferences
        </Typography>
        
        <Box className="settings-item">
          <Box className="settings-text">
            <Typography variant="body1" fontWeight={500} sx={{ color: textColor }}>Dark Mode</Typography>
            <Typography variant="body2" className="settings-description" sx={{ color: descriptionColor }}>
              Enable dark mode for better visibility in low light
            </Typography>
          </Box>
          <Switch 
            checked={darkMode} 
            onChange={(e) => onDarkModeChange(e.target.checked)}
            className="settings-switch"
          />
        </Box>
        
        <Box className="settings-item">
          <Box className="settings-text">
            <Typography variant="body1" fontWeight={500} sx={{ color: textColor }}>Notifications</Typography>
            <Typography variant="body2" className="settings-description" sx={{ color: descriptionColor }}>
              Receive notifications for new reservations and feedback
            </Typography>
          </Box>
          <Switch 
            checked={notifications} 
            onChange={(e) => setNotifications(e.target.checked)}
            className="settings-switch"
          />
        </Box>
        
        <Box className="settings-item">
          <Box className="settings-text">
            <Typography variant="body1" fontWeight={500} sx={{ color: textColor }}>Data Auto-refresh</Typography>
            <Typography variant="body2" className="settings-description" sx={{ color: descriptionColor }}>
              Automatically refresh dashboard data every 5 minutes
            </Typography>
          </Box>
          <Switch 
            checked={autoRefresh} 
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="settings-switch"
          />
        </Box>
      </Box>
      
      <Box className="content-paper" sx={{ mt: 2, color: textColor }}>
        <Typography variant="h6" className="settings-title" sx={{ color: textColor }}>
          Account Settings
        </Typography>
        
        <Box className="account-settings" sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mt: 2 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              className="account-avatar" 
              sx={{ 
                bgcolor: '#e67e22', 
                width: 60, 
                height: 60 
              }}
            >
              {userData.username ? userData.username[0].toUpperCase() : 'A'}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ color: textColor, mb: 0.5 }}>
                {userData.username || 'Loading...'}
              </Typography>
              <Typography variant="body2" sx={{ color: descriptionColor }}>
                {userData.email || 'Loading...'}
              </Typography>
              <Typography variant="body2" sx={{ color: descriptionColor }}>
                Role: Admin
              </Typography>
            </Box>
          </Box>
          
          <Button 
            variant="outlined" 
            color="primary"
            sx={{ 
              borderColor: darkMode ? '#e67e22' : undefined,
              color: darkMode ? '#e67e22' : undefined
            }}
            onClick={() => setChangePasswordOpen(true)}
          >
            CHANGE PASSWORD
          </Button>
        </Box>
      </Box>
      
      {/* Change Password Dialog */}
      <Dialog 
        open={changePasswordOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: darkMode ? '#1a1a1a' : '#fff',
            color: textColor
          }
        }}
      >
        <DialogTitle sx={{ color: textColor }}>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {passwordError && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {passwordError}
              </Typography>
            )}
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              margin="dense"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              sx={{
                '& .MuiInputBase-input': { color: textColor },
                '& .MuiInputLabel-root': { color: descriptionColor },
                '& .MuiOutlinedInput-root': { 
                  '& fieldset': { borderColor: darkMode ? 'rgba(255,255,255,0.2)' : undefined },
                  '&:hover fieldset': { borderColor: darkMode ? 'rgba(255,255,255,0.3)' : undefined }
                }
              }}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="dense"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{
                '& .MuiInputBase-input': { color: textColor },
                '& .MuiInputLabel-root': { color: descriptionColor },
                '& .MuiOutlinedInput-root': { 
                  '& fieldset': { borderColor: darkMode ? 'rgba(255,255,255,0.2)' : undefined },
                  '&:hover fieldset': { borderColor: darkMode ? 'rgba(255,255,255,0.3)' : undefined }
                }
              }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              margin="dense"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{
                '& .MuiInputBase-input': { color: textColor },
                '& .MuiInputLabel-root': { color: descriptionColor },
                '& .MuiOutlinedInput-root': { 
                  '& fieldset': { borderColor: darkMode ? 'rgba(255,255,255,0.2)' : undefined },
                  '&:hover fieldset': { borderColor: darkMode ? 'rgba(255,255,255,0.3)' : undefined }
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: darkMode ? '#e67e22' : undefined }}>Cancel</Button>
          <Button 
            onClick={handleChangePassword} 
            variant="contained" 
            color="primary"
          >
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Settings;