import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Grid,
  Paper,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  Avatar,
  CircularProgress
} from '@mui/material';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import StarIcon from '@mui/icons-material/Star';
import PeopleIcon from '@mui/icons-material/People';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import '../../../../src/utils/chartConfig';
import { chartOptions } from '../../../../src/utils/chartConfig';
import { Reservation, Employee } from '../dashboard';

// Define the feedback data structure based on the API response
interface FeedbackUser {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_num: string | null;
  role: string;
}

interface FeedbackItem {
  feedback_id: number;
  user: FeedbackUser;
  feedback_text: string;
  response_text: string | null;
  experience_rating: number;
  created_at: string;
  updated_at: string;
}

interface DashboardOverviewProps {
  reservations: Reservation[];
  feedback: any[]; // Changed to any[] since we'll use our own state
  employees: Employee[];
  onSectionChange: (section: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  reservations: propReservations,
  feedback: propsFeedback,
  employees,
  onSectionChange
}) => {
  // State for API feedback data
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedbackChartLoading, setFeedbackChartLoading] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState([0, 0, 0, 0, 0]);
  
  // Add new state for reservation chart data
  const [reservationChartData, setReservationChartData] = useState({
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Reservations',
        data: [0, 0, 0, 0, 0, 0, 0], // Initialize with zeros
        backgroundColor: 'rgba(211, 130, 54, 0.4)',
        borderColor: '#d38236',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  });
  const [chartLoading, setChartLoading] = useState(false);

  // Fetch feedback data
  const fetchFeedback = async () => {
    setFeedbackChartLoading(true);
    try {
      const response = await axios.get('http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api/feedback/', {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        }
      });
      
      const feedbackData: FeedbackItem[] = response.data;
      setFeedback(feedbackData);
      
      // Calculate average rating
      if (feedbackData.length > 0) {
        const totalRating = feedbackData.reduce((sum, item) => sum + item.experience_rating, 0);
        setAvgRating(parseFloat((totalRating / feedbackData.length).toFixed(1)));
        
        // Calculate distribution
        const distribution = [0, 0, 0, 0, 0]; // Index 0 for 1 star, 4 for 5 stars
        feedbackData.forEach(item => {
          const index = item.experience_rating - 1;
          if (index >= 0 && index < 5) {
            distribution[index]++;
          }
        });
        setRatingDistribution(distribution.reverse()); // Reverse to match chart order (5 stars first)
      }
    } catch (error) {
      console.error('Error fetching feedback data:', error);
    } finally {
      setFeedbackChartLoading(false);
    }
  };
  
  // Initialize feedback data on component mount
  useEffect(() => {
    setLoading(true);
    fetchFeedback().finally(() => setLoading(false));
  }, []);

  // New effect to fetch reservation chart data
  useEffect(() => {
    const fetchReservationData = async () => {
      setChartLoading(true);
      try {
        const response = await axios.get('http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api/reservations/', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('authToken')}`
          }
        });
        
        // Process the data for chart
        processReservationChartData(response.data);
      } catch (error) {
        console.error('Error fetching reservation data for chart:', error);
      } finally {
        setChartLoading(false);
      }
    };
    
    fetchReservationData();
  }, []);

  // Function to process reservations and count by day of week
  const processReservationChartData = (reservationData: any[]) => {
    // Initialize counts for each day (0 = Monday, 6 = Sunday)
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    
    reservationData.forEach(reservation => {
      if (!reservation.reservation_date) return;
      
      // Parse the reservation date
      const date = new Date(reservation.reservation_date);
      // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      let dayOfWeek = date.getDay();
      // Adjust to make Monday = 0, Sunday = 6
      dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      
      // Only count confirmed reservations
      if (reservation.status === 'CONFIRMED') {
        dayCounts[dayOfWeek]++;
      }
    });
    
    // Update chart data
    setReservationChartData({
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [
        {
          label: 'Confirmed Reservations',
          data: dayCounts,
          backgroundColor: 'rgba(211, 130, 54, 0.4)',
          borderColor: '#d38236',
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    });
  };
  
  // Updated feedback chart to use real data
  const feedbackChartData = {
    labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
    datasets: [
      {
        data: ratingDistribution,
        backgroundColor: [
          '#4CAF50',
          '#8BC34A',
          '#FFC107',
          '#d38236',
          '#F44336'
        ],
        hoverOffset: 4
      },
    ],
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get employee full name
  const getEmployeeName = (employee: Employee) => {
    if (employee.first_name && employee.last_name) {
      return `${employee.first_name} ${employee.last_name}`;
    } else if (employee.first_name) {
      return employee.first_name;
    } else if (employee.username) {
      return employee.username;
    } else {
      return 'Unnamed Employee';
    }
  };

  // Get first letter for avatar
  const getAvatarInitial = (employee: Employee) => {
    if (employee.first_name) {
      return employee.first_name.charAt(0);
    } else if (employee.username) {
      return employee.username.charAt(0);
    } else {
      return 'E';
    }
  };
  
  // Get user's full name from feedback
  const getFeedbackUserName = (item: FeedbackItem) => {
    if (item.user && item.user.first_name && item.user.last_name) {
      return `${item.user.first_name} ${item.user.last_name}`;
    } else if (item.user && item.user.first_name) {
      return item.user.first_name;
    } else if (item.user && item.user.username) {
      return item.user.username;
    }
    return 'Anonymous';
  };

  // Truncate long text with ellipsis
  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Add this helper function to convert 24-hour time to 12-hour format
  const formatTime12Hour = (time24: string) => {
    if (!time24) return '';
    
    // If it's already in the right format or invalid, return as is
    if (!time24.includes(':')) return time24;
    
    try {
      const [hours, minutes] = time24.split(':');
      const hoursNum = parseInt(hours, 10);
      const period = hoursNum >= 12 ? 'PM' : 'AM';
      const hours12 = hoursNum % 12 || 12; // Convert to 12-hour format
      
      return `${hours12}:${minutes} ${period}`;
    } catch (error) {
      return time24; // Return original if conversion fails
    }
  };

  // Add this helper function to normalize role titles
  const formatRoleTitle = (role: string) => {
    if (!role) return '';
    
    // Convert from formats like "BAR_MANAGER" to "Bar Manager"
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Grid container spacing={3}>
        {/* Stats Cards - removed weekly revenue */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper className="stats-card">
            <Box className="stats-header">
              <Typography className="stats-title" sx={{ color: '#e0e0e0' }}>Total Reservations</Typography>
              <BookOnlineIcon className="stats-icon" sx={{ color: '#d38236' }} />
            </Box>
            <Typography variant="h4" className="stats-value" sx={{ color: '#ffffff' }}>{propReservations.length || 0}</Typography>
            <Typography variant="body2" className="stats-trend positive" sx={{ color: '#4caf50' }}>
              Recent activity
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className="stats-card">
            <Box className="stats-header">
              <Typography className="stats-title" sx={{ color: '#e0e0e0' }}>Avg. Feedback</Typography>
              <StarIcon className="stats-icon" sx={{ color: '#f5b74e' }} />
            </Box>
            <Typography variant="h4" className="stats-value" sx={{ color: '#ffffff' }}>{avgRating}</Typography>
            <Typography variant="body2" className="stats-trend positive" sx={{ color: '#4caf50' }}>
              Based on {feedback.length} reviews
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className="stats-card">
            <Box className="stats-header">
              <Typography className="stats-title" sx={{ color: '#e0e0e0' }}>Active Employees</Typography>
              <PeopleIcon className="stats-icon" sx={{ color: '#8eccff' }} />
            </Box>
            <Typography variant="h4" className="stats-value" sx={{ color: '#ffffff' }}>{employees.filter(e => e.is_active).length}</Typography>
            <Typography variant="body2" className="stats-trend positive" sx={{ color: '#4caf50' }}>
              {employees.length} total
            </Typography>
          </Paper>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper className="chart-paper">
            <Box className="chart-header">
              <Typography variant="h6" className="chart-title" sx={{ color: '#e0e0e0' }}>Reservation Trends</Typography>
              <IconButton 
                size="small" 
                className="refresh-btn" 
                sx={{ color: '#8eccff' }}
                disabled={chartLoading}
                onClick={async () => {
                  try {
                    setChartLoading(true);
                    const response = await axios.get('http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api/reservations/', {
                      headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`
                      }
                    });
                    processReservationChartData(response.data);
                  } catch (error) {
                    console.error('Error refreshing reservation data:', error);
                  } finally {
                    setChartLoading(false);
                  }
                }}
              >
                {chartLoading ? <CircularProgress size={16} sx={{ color: '#8eccff' }} /> : <RefreshIcon fontSize="small" />}
              </IconButton>
            </Box>
            <Box className="chart-container">
              <Line 
                data={reservationChartData} 
                options={chartOptions}
                id="reservations-chart"
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className="chart-paper">
            <Box className="chart-header">
              <Typography variant="h6" className="chart-title" sx={{ color: '#e0e0e0' }}>Feedback Ratings</Typography>
              <IconButton 
                size="small" 
                className="refresh-btn" 
                sx={{ color: '#8eccff' }}
                disabled={feedbackChartLoading}
                onClick={() => fetchFeedback()}
              >
                {feedbackChartLoading ? <CircularProgress size={16} sx={{ color: '#8eccff' }} /> : <RefreshIcon fontSize="small" />}
              </IconButton>
            </Box>
            <Box className="chart-container doughnut-container">
              <Doughnut 
                data={feedbackChartData}
                options={{
                  ...chartOptions,
                  cutout: '70%'
                }}
                id="distribution-chart"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Recent Reservation */}
        <Grid item xs={12} md={6}>
          <Paper className="table-paper">
            <Box className="table-header">
              <Typography variant="h6" className="table-title" sx={{ color: '#e0e0e0' }}>Recent Reservations</Typography>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => onSectionChange('reservations')}
                className="view-all-btn"
                sx={{ 
                  color: '#e0e0e0',
                  borderColor: '#555555',
                  '&:hover': { borderColor: '#8eccff', backgroundColor: 'rgba(142, 204, 255, 0.1)' }
                }}
              >
                View All
              </Button>
            </Box>
            <TableContainer className="table-container">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#b0b0b0', borderBottomColor: '#333333' }}>Name</TableCell>
                    <TableCell sx={{ color: '#b0b0b0', borderBottomColor: '#333333' }}>Date</TableCell>
                    <TableCell sx={{ color: '#b0b0b0', borderBottomColor: '#333333' }}>Time</TableCell>
                    <TableCell sx={{ color: '#b0b0b0', borderBottomColor: '#333333' }}>Guests</TableCell>
                    <TableCell sx={{ color: '#b0b0b0', borderBottomColor: '#333333' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {propReservations.slice(0, 5).map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell sx={{ color: '#e0e0e0', borderBottomColor: '#333333' }}>{reservation.guest_name}</TableCell>
                      <TableCell sx={{ color: '#e0e0e0', borderBottomColor: '#333333' }}>{reservation.reservation_date}</TableCell>
                      <TableCell sx={{ color: '#e0e0e0', borderBottomColor: '#333333' }}>{formatTime12Hour(reservation.reservation_time)}</TableCell>
                      <TableCell sx={{ color: '#e0e0e0', borderBottomColor: '#333333' }}>{reservation.number_of_guests}</TableCell>
                      <TableCell sx={{ borderBottomColor: '#333333' }}>
                        <Chip 
                          label={reservation.status} 
                          size="small"
                          sx={{
                            bgcolor: 'transparent',
                            border: '1px solid',
                            borderColor: reservation.status?.toLowerCase() === 'confirmed' ? '#4caf50' : 
                                    reservation.status?.toLowerCase() === 'pending' ? '#f5b74e' : 
                                    reservation.status?.toLowerCase() === 'rejected' ? '#f44336' : 
                                    reservation.status?.toLowerCase() === 'cancelled' ? '#f44336' : '#757575',
                            color: reservation.status?.toLowerCase() === 'confirmed' ? '#4caf50' : 
                                  reservation.status?.toLowerCase() === 'pending' ? '#f5b74e' : 
                                  reservation.status?.toLowerCase() === 'rejected' ? '#f44336' : 
                                  reservation.status?.toLowerCase() === 'cancelled' ? '#f44336' : '#757575',
                            fontWeight: 500,
                            '& .MuiChip-label': {
                              px: 1
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent Feedback - Using Real API Data */}
        <Grid item xs={12} md={6}>
          <Paper className="table-paper">
            <Box className="table-header">
              <Typography variant="h6" className="table-title" sx={{ color: '#e0e0e0' }}>Recent Feedback</Typography>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => onSectionChange('feedback')}
                className="view-all-btn"
                sx={{ 
                  color: '#e0e0e0',
                  borderColor: '#555555',
                  '&:hover': { borderColor: '#8eccff', backgroundColor: 'rgba(142, 204, 255, 0.1)' }
                }}
              >
                View All
              </Button>
            </Box>
            <TableContainer className="table-container">
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={24} sx={{ color: '#d38236' }} />
                </Box>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#b0b0b0', borderBottomColor: '#333333' }}>Name</TableCell>
                      <TableCell sx={{ color: '#b0b0b0', borderBottomColor: '#333333' }}>Date</TableCell>
                      <TableCell sx={{ color: '#b0b0b0', borderBottomColor: '#333333' }}>Rating</TableCell>
                      <TableCell sx={{ color: '#b0b0b0', borderBottomColor: '#333333' }}>Comment</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {feedback.slice(0, 5).map((item) => (
                      <TableRow key={item.feedback_id}>
                        <TableCell sx={{ color: '#e0e0e0', borderBottomColor: '#333333' }}>{getFeedbackUserName(item)}</TableCell>
                        <TableCell sx={{ color: '#e0e0e0', borderBottomColor: '#333333' }}>{formatDate(item.created_at)}</TableCell>
                        <TableCell sx={{ borderBottomColor: '#333333' }}>
                          <Rating 
                            value={item.experience_rating} 
                            readOnly 
                            size="small" 
                            sx={{ 
                              '& .MuiRating-iconFilled': { color: '#f5b74e' },
                              '& .MuiRating-iconEmpty': { color: '#666666' }
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#e0e0e0', borderBottomColor: '#333333' }}>
                          <Typography variant="body2" className="ellipsis" sx={{ color: '#e0e0e0' }}>
                            {truncateText(item.feedback_text, 60)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Paper>
        </Grid>

        {/* Active Staff - updated to filter out admin/owner roles */}
        <Grid item xs={12}>
          <Paper className="table-paper">
            <Box className="table-header">
              <Typography variant="h6" className="table-title" sx={{ color: '#e0e0e0' }}>Active Staff</Typography>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => onSectionChange('employees')}
                className="view-all-btn"
                sx={{ 
                  color: '#e0e0e0',
                  borderColor: '#555555',
                  '&:hover': { borderColor: '#8eccff', backgroundColor: 'rgba(142, 204, 255, 0.1)' }
                }}
              >
                View All
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, p: 2 }}>
              {employees
                .filter(e => 
                  e.is_active && 
                  (!e.role?.toLowerCase().includes('admin') && !e.role?.toLowerCase().includes('owner'))
                )
                .slice(0, 5)
                .map((employee) => (
                  <Paper key={employee.user_id} sx={{ p: 2, width: 200, textAlign: 'center', bgcolor: '#222222' }}>
                    <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 1, bgcolor: '#2e4a66' }}>
                      {getAvatarInitial(employee)}
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                      {getEmployeeName(employee)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                      {formatRoleTitle(employee.role)}
                    </Typography>
                  </Paper>
                ))
              }
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default DashboardOverview;