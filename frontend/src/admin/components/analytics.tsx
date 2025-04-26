import React from 'react';
import { Paper, Box, Typography, Grid, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';

const AnalyticsSection: React.FC = () => {
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

  return (
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
            <Box className="content-actions">
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Time Period</InputLabel>
                <Select
                  value="6months"
                  label="Time Period"
                >
                  <MenuItem value="30days">Last 30 Days</MenuItem>
                  <MenuItem value="6months">Last 6 Months</MenuItem>
                  <MenuItem value="1year">Last Year</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className="chart-paper">
                <Box className="chart-header">
                  <Typography variant="h6" className="chart-title">Revenue Breakdown</Typography>
                </Box>
                <Box className="chart-container large">
                  <Bar 
                    data={revenueChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
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
            
            <Grid item xs={12} md={6}>
              <Paper className="chart-paper">
                <Box className="chart-header">
                  <Typography variant="h6" className="chart-title">Customer Demographics</Typography>
                </Box>
                <Box className="chart-container">
                  {/* Add demographic charts here */}
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper className="chart-paper">
                <Box className="chart-header">
                  <Typography variant="h6" className="chart-title">Popular Times</Typography>
                </Box>
                <Box className="chart-container">
                  {/* Add time popularity heatmap here */}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnalyticsSection;