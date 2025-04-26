import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  Divider, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Container,
  Grid, 
  Paper, 
  Avatar,
  Tabs,
  Tab,
  Badge,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import FeedbackIcon from '@mui/icons-material/Feedback';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import StarIcon from '@mui/icons-material/Star';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// Charts
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Import CSS
import '../styles/dashboard.css';

// Mock data
const mockReservations = [
  { id: 1, name: 'John Doe', date: '2025-04-28', time: '19:00', guests: 4, tableType: 'VIP Booth', status: 'confirmed' },
  { id: 2, name: 'Jane Smith', date: '2025-04-28', time: '20:00', guests: 2, tableType: 'Bar', status: 'confirmed' },
  { id: 3, name: 'Mike Johnson', date: '2025-04-29', time: '18:30', guests: 8, tableType: 'Large Table', status: 'pending' },
  { id: 4, name: 'Sarah Williams', date: '2025-04-30', time: '21:00', guests: 6, tableType: 'VIP Booth', status: 'confirmed' },
  { id: 5, name: 'Robert Brown', date: '2025-05-01', time: '19:30', guests: 3, tableType: 'Regular', status: 'cancelled' },
];

const mockFeedback = [
  { id: 1, name: 'Michael J.', date: '2025-04-15', rating: 5, comment: 'Best place to watch NBA games! The atmosphere during playoffs is unbeatable.' },
  { id: 2, name: 'Sarah T.', date: '2025-04-20', rating: 4, comment: 'Love the food selection and craft beer options. My go-to spot on weekends!' },
  { id: 3, name: 'David R.', date: '2025-04-22', rating: 5, comment: 'The karaoke rooms are fantastic for private parties. Had an amazing birthday celebration here!' },
  { id: 4, name: 'Kimberly L.', date: '2025-04-25', rating: 5, comment: 'Excellent service and the best chicken wings in town. Always my first choice for game nights.' },
  { id: 5, name: 'Jason M.', date: '2025-04-26', rating: 4, comment: 'Great screens, great drinks, great vibe. What more could you ask for?' },
];

const drawerWidth = 260;

const AdminDashboard: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [loading, setLoading] = useState<boolean>(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [tabValue, setTabValue] = useState(0);
  const [reservationDialog, setReservationDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchorEl(null);
  };

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
    setMobileOpen(false);
  };

  const handleOpenReservationDialog = (reservation: any) => {
    setSelectedReservation(reservation);
    setReservationDialog(true);
  };

  const handleCloseReservationDialog = () => {
    setReservationDialog(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredReservations = mockReservations.filter(res => 
    res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.date.includes(searchQuery) ||
    res.tableType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFeedback = mockFeedback.filter(feedback =>
    feedback.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feedback.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chart data
  const reservationsChartData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Reservations',
        data: [12, 19, 15, 25, 38, 45, 33],
        backgroundColor: 'rgba(211, 130, 54, 0.4)',
        borderColor: '#d38236',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };
  
  const feedbackChartData = {
    labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
    datasets: [
      {
        data: [65, 20, 10, 3, 2],
        backgroundColor: [
          '#4CAF50',
          '#8BC34A',
          '#FFC107',
          '#FF9800',
          '#F44336'
        ],
        hoverOffset: 4
      },
    ],
  };

  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Food',
        data: [4200, 5100, 6300, 8100, 7200, 9100],
        backgroundColor: 'rgba(211, 130, 54, 0.6)',
      },
      {
        label: 'Drinks',
        data: [5800, 4800, 7200, 6900, 8500, 10200],
        backgroundColor: 'rgba(65, 105, 225, 0.6)',
      },
    ],
  };

  const drawer = (
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
          onClick={() => handleSectionChange('dashboard')}
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
          onClick={() => handleSectionChange('reservations')}
          className={`sidebar-item ${selectedSection === 'reservations' ? 'active' : ''}`}
        >
          <ListItemIcon>
            <BookOnlineIcon className="sidebar-icon" />
          </ListItemIcon>
          <ListItemText primary="Reservations" />
        </ListItem>
        <ListItem 
          button 
          selected={selectedSection === 'feedback'}
          onClick={() => handleSectionChange('feedback')}
          className={`sidebar-item ${selectedSection === 'feedback' ? 'active' : ''}`}
        >
          <ListItemIcon>
            <FeedbackIcon className="sidebar-icon" />
          </ListItemIcon>
          <ListItemText primary="Feedback" />
        </ListItem>
        <ListItem 
          button
          selected={selectedSection === 'customers'}
          onClick={() => handleSectionChange('customers')}
          className={`sidebar-item ${selectedSection === 'customers' ? 'active' : ''}`}
        >
          <ListItemIcon>
            <PeopleIcon className="sidebar-icon" />
          </ListItemIcon>
          <ListItemText primary="Customers" />
        </ListItem>
        <ListItem 
          button
          selected={selectedSection === 'analytics'}
          onClick={() => handleSectionChange('analytics')}
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
          onClick={() => handleSectionChange('settings')}
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

  // Content sections
  const renderDashboard = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="stats-card">
              <Box className="stats-header">
                <Typography className="stats-title">Total Reservations</Typography>
                <BookOnlineIcon className="stats-icon" />
              </Box>
              <Typography variant="h4" className="stats-value">128</Typography>
              <Typography variant="body2" className="stats-trend positive">
                +12% from last week
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="stats-card">
              <Box className="stats-header">
                <Typography className="stats-title">Avg. Feedback</Typography>
                <StarIcon className="stats-icon" />
              </Box>
              <Typography variant="h4" className="stats-value">4.8</Typography>
              <Typography variant="body2" className="stats-trend positive">
                +0.3 from last week
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="stats-card">
              <Box className="stats-header">
                <Typography className="stats-title">Active Customers</Typography>
                <PeopleIcon className="stats-icon" />
              </Box>
              <Typography variant="h4" className="stats-value">427</Typography>
              <Typography variant="body2" className="stats-trend positive">
                +24 new this week
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="stats-card">
              <Box className="stats-header">
                <Typography className="stats-title">Weekly Revenue</Typography>
                <SportsBarIcon className="stats-icon" />
              </Box>
              <Typography variant="h4" className="stats-value">$12.4k</Typography>
              <Typography variant="body2" className="stats-trend negative">
                -3% from last week
              </Typography>
            </Paper>
          </Grid>

          {/* Charts */}
          <Grid item xs={12} md={8}>
            <Paper className="chart-paper">
              <Box className="chart-header">
                <Typography variant="h6" className="chart-title">Reservation Trends</Typography>
                <IconButton size="small" className="refresh-btn">
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box className="chart-container">
                <Line 
                  data={reservationsChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: {
                          color: '#bbb'
                        }
                      }
                    },
                    scales: {
                      y: {
                        ticks: {
                          color: '#aaa'
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.05)'
                        }
                      },
                      x: {
                        ticks: {
                          color: '#aaa'
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.05)'
                        }
                      }
                    }
                  }}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className="chart-paper">
              <Box className="chart-header">
                <Typography variant="h6" className="chart-title">Feedback Ratings</Typography>
                <IconButton size="small" className="refresh-btn">
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box className="chart-container doughnut-container">
                <Doughnut 
                  data={feedbackChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: '#bbb'
                        }
                      }
                    }
                  }}  
                />
              </Box>
            </Paper>
          </Grid>

          {/* Recent Reservation */}
          <Grid item xs={12} md={6}>
            <Paper className="table-paper">
              <Box className="table-header">
                <Typography variant="h6" className="table-title">Recent Reservations</Typography>
                <Button 
                  size="small" 
                  variant="outlined" 
                  endIcon={<VisibilityIcon />} 
                  onClick={() => handleSectionChange('reservations')}
                  className="view-all-btn"
                >
                  View All
                </Button>
              </Box>
              <TableContainer className="table-container">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Guests</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockReservations.slice(0, 4).map((row) => (
                      <TableRow key={row.id} className="table-row">
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.time}</TableCell>
                        <TableCell>{row.guests}</TableCell>
                        <TableCell>
                          <Chip 
                            label={row.status} 
                            size="small"
                            className={`status-chip ${row.status}`}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Recent Feedback */}
          <Grid item xs={12} md={6}>
            <Paper className="table-paper">
              <Box className="table-header">
                <Typography variant="h6" className="table-title">Recent Feedback</Typography>
                <Button 
                  size="small" 
                  variant="outlined"
                  endIcon={<VisibilityIcon />}
                  onClick={() => handleSectionChange('feedback')}
                  className="view-all-btn"
                >
                  View All
                </Button>
              </Box>
              <Box className="feedback-list-container">
                {mockFeedback.slice(0, 3).map((item) => (
                  <Box key={item.id} className="feedback-item">
                    <Box className="feedback-header">
                      <Typography variant="subtitle2" className="feedback-name">{item.name}</Typography>
                      <Typography variant="caption" className="feedback-date">{item.date}</Typography>
                    </Box>
                    <Rating value={item.rating} readOnly size="small" />
                    <Typography variant="body2" className="feedback-comment">
                      {item.comment.length > 100 ? `${item.comment.substring(0, 100)}...` : item.comment}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </AnimatePresence>
  );

  const renderReservations = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key="reservations"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Paper className="content-paper">
          <Box className="content-header">
            <Typography variant="h5" className="content-title">Reservations</Typography>
            <Box className="content-actions">
              <TextField
                size="small"
                placeholder="Search reservations"
                value={searchQuery}
                onChange={handleSearch}
                className="search-field"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="search-icon" />
                    </InputAdornment>
                  ),
                }}
              />
              <IconButton size="small" className="filter-btn">
                <TuneIcon />
              </IconButton>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                className="add-btn"
              >
                Add New
              </Button>
            </Box>
          </Box>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            className="content-tabs"
          >
            <Tab label="All Reservations" />
            <Tab label="Confirmed" />
            <Tab label="Pending" />
            <Tab label="Cancelled" />
          </Tabs>

          <TableContainer className="table-container">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Guests</TableCell>
                  <TableCell>Table Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReservations.map((row) => (
                  <TableRow key={row.id} className="table-row">
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>{row.guests}</TableCell>
                    <TableCell>{row.tableType}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status} 
                        size="small"
                        className={`status-chip ${row.status}`}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        className="action-btn view-btn"
                        onClick={() => handleOpenReservationDialog(row)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" className="action-btn delete-btn">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog
          open={reservationDialog}
          onClose={handleCloseReservationDialog}
          className="reservation-dialog"
        >
          {selectedReservation && (
            <>
              <DialogTitle className="dialog-title">
                Reservation Details
                <IconButton
                  onClick={handleCloseReservationDialog}
                  size="small"
                  className="dialog-close"
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent className="dialog-content">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Customer</Typography>
                    <Typography variant="body1" className="detail-value">{selectedReservation.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Reservation ID</Typography>
                    <Typography variant="body1" className="detail-value">#{selectedReservation.id}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Date</Typography>
                    <Typography variant="body1" className="detail-value">{selectedReservation.date}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Time</Typography>
                    <Typography variant="body1" className="detail-value">{selectedReservation.time}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Number of Guests</Typography>
                    <Typography variant="body1" className="detail-value">{selectedReservation.guests}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Table Type</Typography>
                    <Typography variant="body1" className="detail-value">{selectedReservation.tableType}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Status</Typography>
                    <Chip 
                      label={selectedReservation.status} 
                      className={`status-chip ${selectedReservation.status}`}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions className="dialog-actions">
                <Button 
                  onClick={handleCloseReservationDialog} 
                  className="dialog-btn cancel-btn"
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained"
                  className="dialog-btn confirm-btn"
                >
                  Update Status
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </motion.div>
    </AnimatePresence>
  );

  const renderFeedback = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key="feedback"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Paper className="content-paper">
          <Box className="content-header">
            <Typography variant="h5" className="content-title">Customer Feedback</Typography>
            <Box className="content-actions">
              <TextField
                size="small"
                placeholder="Search feedback"
                value={searchQuery}
                onChange={handleSearch}
                className="search-field"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="search-icon" />
                    </InputAdornment>
                  ),
                }}
              />
              <IconButton size="small" className="filter-btn">
                <TuneIcon />
              </IconButton>
            </Box>
          </Box>

          <Box className="feedback-summary">
            <Paper className="summary-card">
              <Box className="summary-content">
                <Typography className="summary-title">Average Rating</Typography>
                <Typography variant="h4" className="summary-value">4.6</Typography>
              </Box>
              <Rating value={4.6} precision={0.1} readOnly />
            </Paper>
            
            <Paper className="summary-card">
              <Box className="summary-content">
                <Typography className="summary-title">Total Reviews</Typography>
                <Typography variant="h4" className="summary-value">87</Typography>
              </Box>
              <Box className="rating-breakdown">
                <Box className="rating-bar">
                  <Typography variant="caption">5★</Typography>
                  <Box className="bar-container">
                    <Box className="bar-fill" sx={{ width: '65%' }}></Box>
                  </Box>
                  <Typography variant="caption">65%</Typography>
                </Box>
                <Box className="rating-bar">
                  <Typography variant="caption">4★</Typography>
                  <Box className="bar-container">
                    <Box className="bar-fill" sx={{ width: '20%' }}></Box>
                  </Box>
                  <Typography variant="caption">20%</Typography>
                </Box>
                <Box className="rating-bar">
                  <Typography variant="caption">3★</Typography>
                  <Box className="bar-container">
                    <Box className="bar-fill" sx={{ width: '10%' }}></Box>
                  </Box>
                  <Typography variant="caption">10%</Typography>
                </Box>
                <Box className="rating-bar">
                  <Typography variant="caption">2★</Typography>
                  <Box className="bar-container">
                    <Box className="bar-fill" sx={{ width: '3%' }}></Box>
                  </Box>
                  <Typography variant="caption">3%</Typography>
                </Box>
                <Box className="rating-bar">
                  <Typography variant="caption">1★</Typography>
                  <Box className="bar-container">
                    <Box className="bar-fill" sx={{ width: '2%' }}></Box>
                  </Box>
                  <Typography variant="caption">2%</Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
          
          <Box className="feedback-grid">
            {filteredFeedback.map((feedback) => (
              <Paper key={feedback.id} className="feedback-card">
                <Box className="feedback-card-header">
                  <Box className="feedback-user">
                    <Avatar className="feedback-avatar">{feedback.name.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="subtitle2">{feedback.name}</Typography>
                      <Typography variant="caption" className="feedback-date">{feedback.date}</Typography>
                    </Box>
                  </Box>
                  <Rating value={feedback.rating} readOnly size="small" />
                </Box>
                
                <Typography variant="body2" className="feedback-message">
                  <FormatQuoteIcon className="quote-icon" />
                  {feedback.comment}
                </Typography>
                
                <Box className="feedback-actions">
                  <Button 
                    size="small" 
                    startIcon={<CheckCircleIcon />}
                    className="btn-respond"
                  >
                    Respond
                  </Button>
                  <IconButton size="small" className="action-btn delete-btn">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        </Paper>
      </motion.div>
    </AnimatePresence>
  );

  const renderAnalytics = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key="analytics"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Paper className="content-paper">
          <Box className="content-header">
            <Typography variant="h5" className="content-title">Business Analytics</Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className="chart-paper">
                <Box className="chart-header">
                  <Typography variant="h6" className="chart-title">Revenue</Typography>
                  <IconButton size="small" className="refresh-btn">
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box className="chart-container large">
                  <Bar 
                    data={revenueChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          labels: {
                            color: '#bbb'
                          }
                        }
                      },
                      scales: {
                        y: {
                          ticks: {
                            color: '#aaa',
                            callback: function(value) {
                              return '$' + value;
                            }
                          },
                          grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                          }
                        },
                        x: {
                          ticks: {
                            color: '#aaa'
                          },
                          grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                          }
                        }
                      }
                    }} 
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </AnimatePresence>
  );

  const renderSettings = () => (
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
                <Typography variant="h6" className="settings-title">User Preferences</Typography>
                
                <Box className="settings-item">
                  <Box className="settings-text">
                    <Typography variant="subtitle1">Dark Mode</Typography>
                    <Typography variant="body2" className="settings-description">
                      Enable dark mode for better visibility in low light
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={darkMode} 
                        onChange={() => setDarkMode(!darkMode)} 
                        className="settings-switch"
                      />
                    }
                    label=""
                  />
                </Box>
                
                <Box className="settings-item">
                  <Box className="settings-text">
                    <Typography variant="subtitle1">Notifications</Typography>
                    <Typography variant="body2" className="settings-description">
                      Receive notifications for new reservations and feedback
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={<Switch defaultChecked className="settings-switch" />}
                    label=""
                  />
                </Box>
                
                <Box className="settings-item">
                  <Box className="settings-text">
                    <Typography variant="subtitle1">Data Auto-refresh</Typography>
                    <Typography variant="body2" className="settings-description">
                      Automatically refresh dashboard data every 5 minutes
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={<Switch defaultChecked className="settings-switch" />}
                    label=""
                  />
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper className="settings-section">
                <Typography variant="h6" className="settings-title">Account Settings</Typography>
                
                <Box className="account-settings">
                  <Box className="account-info">
                    <Avatar className="account-avatar">A</Avatar>
                    <Box>
                      <Typography variant="subtitle1">Admin User</Typography>
                      <Typography variant="body2">admin@stopshot.com</Typography>
                    </Box>
                  </Box>
                  
                  <Button 
                    variant="outlined"
                    className="change-password-btn"
                  >
                    Change Password
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </AnimatePresence>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <Box className="loading-container">
          <CircularProgress className="loading-spinner" />
          <Typography variant="h6" className="loading-text">
            Loading Dashboard...
          </Typography>
        </Box>
      );
    }
    
    switch (selectedSection) {
      case 'dashboard':
        return renderDashboard();
      case 'reservations':
        return renderReservations();
      case 'feedback':
        return renderFeedback();
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <Box className={`admin-dashboard ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <AppBar 
        position="fixed" 
        className="app-bar"
        sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}
      >
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className="menu-button"
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <IconButton className="header-icon" onClick={handleNotificationMenuOpen}>
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <IconButton
            edge="end"
            onClick={handleProfileMenuOpen}
            className="profile-icon"
          >
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        className="nav-drawer"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
          className="mobile-drawer"
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
          className="desktop-drawer"
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
        className="main-content"
      >
        <Toolbar />
        <Box className="page-content">
          {renderContent()}
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        className="profile-menu"
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
        <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
      </Menu>

      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleMenuClose}
        className="notification-menu"
      >
        <MenuItem onClick={handleMenuClose} className="notification-item">
          <Badge color="primary" variant="dot" className="notification-badge">
            <Typography variant="body2">New reservation from John Doe</Typography>
          </Badge>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} className="notification-item">
          <Badge color="primary" variant="dot" className="notification-badge">
            <Typography variant="body2">New feedback (5 stars)</Typography>
          </Badge>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} className="notification-item">
          <Typography variant="body2">Reservation cancelled</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} className="notification-action">
          <Typography variant="body2" align="center">View all notifications</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AdminDashboard;