import React, { useState } from 'react';
import { Paper, Box, Typography, Grid, Switch, Button, Avatar, TextField, FormControlLabel } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsSection: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="settings"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Paper className="content-paper">
          <Box className="content-header">
            <Typography variant="h5" className="content-title">Settings</Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper className="settings-section">
                <Typography variant="h6" className="settings-title">
                  Appearance
                </Typography>
                
                <Box className="settings-item">
                  <Box className="settings-text">
                    <Typography variant="body1">Dark Mode</Typography>
                    <Typography variant="body2" className="settings-description">
                      Enable dark theme for the admin dashboard
                    </Typography>
                  </Box>
                  <Switch 
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                    className="settings-switch"
                  />
                </Box>
                
                <Box className="settings-item">
                  <Box className="settings-text">
                    <Typography variant="body1">Push Notifications</Typography>
                    <Typography variant="body2" className="settings-description">
                      Receive notifications for new reservations and feedback
                    </Typography>
                  </Box>
                  <Switch 
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                    className="settings-switch"
                  />
                </Box>
                
                <Box className="settings-item">
                  <Box className="settings-text">
                    <Typography variant="body1">Email Alerts</Typography>
                    <Typography variant="body2" className="settings-description">
                      Get daily summaries and reports via email
                    </Typography>
                  </Box>
                  <Switch 
                    checked={emailAlerts}
                    onChange={() => setEmailAlerts(!emailAlerts)}
                    className="settings-switch"
                  />
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper className="settings-section">
                <Typography variant="h6" className="settings-title">
                  Account Settings
                </Typography>
                
                <Box className="account-settings">
                  <Box className="account-info">
                    <Avatar className="account-avatar">A</Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Admin User
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        admin@stopshot.com
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Name"
                        defaultValue="Admin User"
                        fullWidth
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Email"
                        defaultValue="admin@stopshot.com"
                        fullWidth
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Button 
                        variant="outlined" 
                        className="change-password-btn"
                      >
                        Change Password
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsSection;