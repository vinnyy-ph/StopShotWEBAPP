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
  Rating
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
import { Reservation } from '../dashboard';
import { mockFeedbackData } from '../dashboard';

interface DashboardOverviewProps {
  reservations: Reservation[];
  feedback: typeof mockFeedbackData;
  onSectionChange: (section: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  reservations,
  feedback,
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
                  {reservations.slice(0, 5).map((row) => (
                    <TableRow key={row.id} className="table-row">
                      <TableCell>{row.guest_name}</TableCell>
                      <TableCell>{row.reservation_date}</TableCell>
                      <TableCell>{row.reservation_time}</TableCell>
                      <TableCell>{row.number_of_guests}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status_display || row.status} 
                          size="small"
                          className={`status-chip ${row.status.toLowerCase()}`}
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
            <Box className="feedback-list-container">
              {feedback.slice(0, 3).map((item) => (
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
  );
};

export default DashboardOverview;