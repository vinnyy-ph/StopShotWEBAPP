// admin/components/layout/Sidebar.tsx
import React from 'react';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import FeedbackIcon from '@mui/icons-material/Feedback';
import WorkIcon from '@mui/icons-material/Work';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

interface SidebarProps {
  selectedSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedSection, onSectionChange }) => {
  return (
    <div className="sidebar-container">
      <Box className="sidebar-header">
        <SportsBasketballIcon className="sidebar-logo-icon" />
        <Typography variant="h6" className="sidebar-title">
          StopShot Admin
        </Typography>
      </Box>
      <Divider className="sidebar-divider" />
      <List className="sidebar-nav">
        <ListItem 
          button 
          selected={selectedSection === 'dashboard'}
          onClick={() => onSectionChange('dashboard')}
          className={`sidebar-item ${selectedSection === 'dashboard' ? 'active' : ''}`}
        >
          <ListItemIcon>
            <DashboardIcon className="sidebar-icon" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem 
          button 
          selected={selectedSection === 'reservations'}
          onClick={() => onSectionChange('reservations')}
          className={`sidebar-item ${selectedSection === 'reservations' ? 'active' : ''}`}
        >
          <ListItemIcon>
            <BookOnlineIcon className="sidebar-icon" />
          </ListItemIcon>
          <ListItemText primary="Reservations" />
        </ListItem>
        <ListItem 
          button 
          selected={selectedSection === 'menu'}
          onClick={() => onSectionChange('menu')}
          className={`sidebar-item ${selectedSection === 'menu' ? 'active' : ''}`}
        >
          <ListItemIcon>
            <RestaurantMenuIcon className="sidebar-icon" />
          </ListItemIcon>
          <ListItemText primary="Menu" />
        </ListItem>
        <ListItem 
          button 
          selected={selectedSection === 'feedback'}
          onClick={() => onSectionChange('feedback')}
          className={`sidebar-item ${selectedSection === 'feedback' ? 'active' : ''}`}
        >
          <ListItemIcon>
            <FeedbackIcon className="sidebar-icon" />
          </ListItemIcon>
          <ListItemText primary="Feedback" />
        </ListItem>
        <ListItem 
          button
          selected={selectedSection === 'employees'}
          onClick={() => onSectionChange('employees')}
          className={`sidebar-item ${selectedSection === 'employees' ? 'active' : ''}`}
        >
          <ListItemIcon>
            <WorkIcon className="sidebar-icon" />
          </ListItemIcon>
          <ListItemText primary="Employees" />
        </ListItem>
        <ListItem 
          button
          selected={selectedSection === 'analytics'}
          onClick={() => onSectionChange('analytics')}
          className={`sidebar-item ${selectedSection === 'analytics' ? 'active' : ''}`}
        >
          <ListItemIcon>
            <BarChartIcon className="sidebar-icon" />
          </ListItemIcon>
          <ListItemText primary="Analytics" />
        </ListItem>
        <ListItem 
          button
          selected={selectedSection === 'settings'}
          onClick={() => onSectionChange('settings')}
          className={`sidebar-item ${selectedSection === 'settings' ? 'active' : ''}`}
        >
          <ListItemIcon>
            <SettingsIcon className="sidebar-icon" />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box className="sidebar-footer">
        <Divider className="sidebar-divider" />
        <ListItem 
          button 
          onClick={() => window.location.href = '/admin/login'} 
          className="sidebar-logout"
        >
          <ListItemIcon>
            <LogoutIcon className="sidebar-icon" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </Box>
    </div>
  );
};

export default Sidebar;