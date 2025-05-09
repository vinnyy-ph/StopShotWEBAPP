// admin/components/sections/DashboardOverview.tsx
import React from 'react';
import { motion } from 'framer-motion';
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
  Avatar
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
import { mockFeedbackData } from '../dashboard';

interface DashboardOverviewProps {
  reservations: Reservation[];
  feedback: typeof mockFeedbackData;
  employees: Employee[];
  onSectionChange: (section: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  reservations,
  feedback,
  employees,
  onSectionChange
}) => {
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

  return (
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
            <Typography variant="h4" className="stats-value">{reservations.length || 0}</Typography>
            <Typography variant="body2" className="stats-trend positive">
              Recent activity
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
              <Typography className="stats-title">Active Employees</Typography>
              <PeopleIcon className="stats-icon" />
            </Box>
            <Typography variant="h4" className="stats-value">{employees.filter(e => e.is_active).length}</Typography>
            <Typography variant="body2" className="stats-trend positive">
              {employees.length} total
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
                options={chartOptions}
                id="reservations-chart"
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
              <Typography variant="h6" className="table-title">Recent Reservations</Typography>
              <Button 
                size="small" 
                variant="outlined" 
                endIcon={<VisibilityIcon />} 
                onClick={() => onSectionChange('reservations')}
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
                  {reservations.slice(0, 5).map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>{reservation.guest_name}</TableCell>
                      <TableCell>{reservation.reservation_date}</TableCell>
                      <TableCell>{reservation.reservation_time}</TableCell>
                      <TableCell>{reservation.number_of_guests}</TableCell>
                      <TableCell>
                        <Chip 
                          label={reservation.status} 
                          size="small"
                          className={`status-chip ${
                            reservation.status === 'confirmed' ? 'confirmed' : 
                            reservation.status === 'pending' ? 'pending' : 'cancelled'
                          }`}
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
                onClick={() => onSectionChange('feedback')}
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
                    <TableCell>Rating</TableCell>
                    <TableCell>Comment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feedback.slice(0, 5).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <Rating value={item.rating} readOnly size="small" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" className="ellipsis">
                          {item.comment}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Active Staff */}
        <Grid item xs={12}>
          <Paper className="table-paper">
            <Box className="table-header">
              <Typography variant="h6" className="table-title">Active Staff</Typography>
              <Button 
                size="small" 
                variant="outlined" 
                endIcon={<VisibilityIcon />} 
                onClick={() => onSectionChange('employees')}
                className="view-all-btn"
              >
                View All
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, p: 2 }}>
              {employees.filter(e => e.is_active).slice(0, 5).map((employee) => (
                <Paper key={employee.user_id} sx={{ p: 2, width: 200, textAlign: 'center' }}>
                  <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 1, bgcolor: '#d38236' }}>
                    {getAvatarInitial(employee)}
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {getEmployeeName(employee)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {employee.role}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default DashboardOverview;