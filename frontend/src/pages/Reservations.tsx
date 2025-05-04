import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  // Chip,
  FormControl,
  // InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  // Divider
} from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import '../styles/pages/reservations.css';

const ReservationsPage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number>(1); // 0=January, 1=February, etc.
  const [reservationType, setReservationType] = useState('table');
  const [timeSlot, setTimeSlot] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Time slots for reservations
  const timeSlots = [
    '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', 
    '9:00 PM', '10:00 PM', '11:00 PM', '12:00 AM', '1:00 AM'
  ];

  // Randomly mark some days as "busy" (limited availability)
  const busyDays = [5, 12, 19, 25];
  // Days with special events
  const specialEventDays = [8, 15, 22];

  // Adjust the number of days based on the selected month (and a fixed year 2025)
  const daysInCurrentMonth = new Date(2025, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(2025, currentMonth, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysInMonth = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);
  const daysOfWeek = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  
  // Calculate blank spaces at the beginning of the month to align days properly
  const blankDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  // const handleClose = () => {
  //   // Future logic to close modal/page
  // };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1));
    setSelectedDay(null);
  };

  const handleSubmit = () => {
    setShowConfirmation(true);
    // Future logic for form submission
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };

  const isDayBusy = (day: number) => {
    return busyDays.includes(day);
  };

  const isDaySpecialEvent = (day: number) => {
    return specialEventDays.includes(day);
  };

  return (
    <Box className="reservations-page dark-theme" sx={{ py: 6, backgroundColor: '#121212' }}>
      <Container maxWidth="lg">
        {/* Header with Basketball Icon */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          mb: 4,
          position: 'relative'
        }}>
          <SportsBasketballIcon 
            sx={{ 
              color: '#d38236', 
              fontSize: 40, 
              mr: 2,
              animation: 'bounce 2s infinite' 
            }} 
          />
          <Typography 
            variant="h3" 
            sx={{ 
              color: '#fff',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              textShadow: '0px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            Reserve Your Spot
          </Typography>
        </Box>

        <Paper 
          elevation={4} 
          sx={{ 
            backgroundColor: '#1a1a1a', 
            color: '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid #333'
          }} 
          className="reservation-container"
        >
          {/* Orange Top Bar */}
          <Box sx={{ 
            height: '10px', 
            backgroundColor: '#d38236', 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0 
          }} />
          
          <Box sx={{ p: { xs: 2, md: 4 }, pt: 5 }}>
            {/* Reservation Type Selector */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
              <Box 
                className="reservation-type-selector"
                sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  p: 0.5,
                  borderRadius: '50px',
                }}
              >
                <Button 
                  variant={reservationType === 'table' ? 'contained' : 'text'}
                  onClick={() => setReservationType('table')}
                  startIcon={<LocalBarIcon />}
                  sx={{ 
                    borderRadius: '50px',
                    px: 3,
                    backgroundColor: reservationType === 'table' ? '#d38236' : 'transparent',
                    color: reservationType === 'table' ? '#fff' : '#bbb',
                    '&:hover': {
                      backgroundColor: reservationType === 'table' ? '#b05e1d' : 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Table
                </Button>
                <Button 
                  variant={reservationType === 'karaoke' ? 'contained' : 'text'}
                  onClick={() => setReservationType('karaoke')}
                  startIcon={<ChevronRightIcon />}
                  sx={{ 
                    borderRadius: '50px',
                    px: 3,
                    backgroundColor: reservationType === 'karaoke' ? '#d38236' : 'transparent',
                    color: reservationType === 'karaoke' ? '#fff' : '#bbb',
                    '&:hover': {
                      backgroundColor: reservationType === 'karaoke' ? '#b05e1d' : 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Karaoke Room
                </Button>
              </Box>
            </Box>

            {/* Main Content: Form & Calendar */}
            <Grid container spacing={4}>
              {/* Form Section */}
              <Grid item xs={12} md={5}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 3, 
                    color: '#d38236', 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <EventIcon sx={{ mr: 1 }} /> Booking Details
                </Typography>
                
                <Box 
                  component="form" 
                  noValidate 
                  autoComplete="off"
                  sx={{
                    '& .MuiFormControl-root': {
                      mb: 3,
                    },
                    '& .MuiInputBase-root': {
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.08)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        boxShadow: '0 0 0 2px rgba(211, 130, 54, 0.25)',
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: '#aaa'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: '#777',
                      opacity: 1
                    }
                  }}
                >
                  <TextField
                    variant="outlined"
                    placeholder="Enter your name"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: '#d38236' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <FormControl fullWidth>
                    <Select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      displayEmpty
                      renderValue={timeSlot !== '' ? undefined : () => "Select Time Slot"}
                      sx={{
                        '& .MuiSelect-icon': {
                          color: '#d38236'
                        }
                      }}
                    >
                      {timeSlots.map(time => (
                        <MenuItem key={time} value={time} sx={{ color: '#000' }}>
                          {time}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <TextField
                    variant="outlined"
                    placeholder="How many people?"
                    fullWidth
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GroupIcon sx={{ color: '#d38236' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField
                    variant="outlined"
                    placeholder="Enter your contact number"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: '#d38236' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField
                    variant="outlined"
                    placeholder="MM/DD/YYYY"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventIcon sx={{ color: '#d38236' }} />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    value={
                      selectedDay 
                        ? `${String(currentMonth + 1).padStart(2, '0')}/${
                            selectedDay < 10 ? '0' + selectedDay : selectedDay
                          }/2025`
                        : ''
                    }
                  />

                  <TextField
                    variant="outlined"
                    placeholder="Special requests or notes"
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ mt: 1 }}
                  />

                </Box>
              </Grid>

              {/* Calendar Section */}
              <Grid item xs={12} md={7}>
                <Box sx={{ 
                  backgroundColor: '#222',
                  borderRadius: '12px',
                  p: 3,
                  border: '1px solid #333',
                }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 3, 
                      color: '#d38236', 
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <EventIcon sx={{ mr: 1 }} /> Select Your Day
                  </Typography>
                  
                  <Box 
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center" 
                    mb={3}
                    sx={{
                      borderBottom: '1px solid #333',
                      pb: 2
                    }}
                  >
                    <IconButton 
                      onClick={handlePrevMonth}
                      sx={{ 
                        color: '#d38236',
                        '&:hover': {
                          backgroundColor: 'rgba(211, 130, 54, 0.1)'
                        }
                      }}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                    <Typography 
                      variant="h6"
                      sx={{ 
                        fontWeight: 600,
                        color: '#fff',
                        letterSpacing: '1px'
                      }}
                    >
                      {months[currentMonth].toUpperCase()} 2025
                    </Typography>
                    <IconButton 
                      onClick={handleNextMonth}
                      sx={{ 
                        color: '#d38236',
                        '&:hover': {
                          backgroundColor: 'rgba(211, 130, 54, 0.1)'
                        }
                      }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </Box>
                  
                  <Box className="calendar-wrapper">
                    <Box 
                      display="grid" 
                      gridTemplateColumns="repeat(7, 1fr)" 
                      gap={1}
                      mb={2}
                    >
                      {daysOfWeek.map((day) => (
                        <Box 
                          key={day} 
                          className="day-of-week"
                          sx={{
                            textAlign: 'center',
                            py: 1,
                            fontWeight: 600,
                            color: day === 'SA' || day === 'SU' ? '#d38236' : '#999'
                          }}
                        >
                          <Typography variant="body2">{day}</Typography>
                        </Box>
                      ))}
                    </Box>
                    
                    <Box 
                      display="grid" 
                      gridTemplateColumns="repeat(7, 1fr)" 
                      gap={1}
                      sx={{ mb: 3 }}
                    >
                      {/* Empty cells for days before the month starts */}
                      {blankDays.map(blank => (
                        <Box key={`blank-${blank}`} className="calendar-day-blank"></Box>
                      ))}
                      
                      {/* Actual days of the month */}
                      {daysInMonth.map((day) => {
                        const isBusy = isDayBusy(day);
                        const isSpecial = isDaySpecialEvent(day);
                        
                        return (
                          <Box
                            key={day}
                            onClick={() => handleDayClick(day)}
                            sx={{
                              cursor: 'pointer',
                              py: 1,
                              border: `1px solid ${selectedDay === day ? '#d38236' : '#333'}`,
                              borderRadius: '8px',
                              backgroundColor: selectedDay === day 
                                ? 'rgba(211, 130, 54, 0.3)' 
                                : isSpecial 
                                  ? 'rgba(211, 130, 54, 0.1)'
                                  : 'rgba(255,255,255,0.03)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                backgroundColor: selectedDay === day 
                                  ? 'rgba(211, 130, 54, 0.4)' 
                                  : 'rgba(211, 130, 54, 0.15)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
                              }
                            }}
                            className={`calendar-day-box ${selectedDay === day ? 'selected-day' : ''}`}
                          >
                            <Typography
                              variant="body2" 
                              sx={{ 
                                fontWeight: selectedDay === day ? 700 : 400,
                                color: selectedDay === day ? '#d38236' : '#fff',
                                fontSize: '1rem'
                              }}
                            >
                              {day}
                            </Typography>
                            
                            {isBusy && (
                              <Box 
                                className="busy-indicator"
                                sx={{
                                  position: 'absolute',
                                  bottom: '4px',
                                  height: '3px',
                                  width: '16px',
                                  backgroundColor: 'rgba(255, 87, 34, 0.7)',
                                  borderRadius: '2px'
                                }}
                              />
                            )}
                            {isSpecial && (
                              <Box 
                                className="special-indicator"
                                sx={{
                                  position: 'absolute',
                                  top: '4px',
                                  right: '4px',
                                  height: '8px',
                                  width: '8px',
                                  backgroundColor: '#d38236',
                                  borderRadius: '50%'
                                }}
                              />
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                    
                    {/* Legend */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-around',
                        flexWrap: 'wrap',
                        gap: 1,
                        mt: 2,
                        pt: 2,
                        borderTop: '1px solid #333'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          width: '10px', 
                          height: '10px', 
                          backgroundColor: '#d38236',
                          borderRadius: '50%',
                          mr: 1
                        }} />
                        <Typography variant="caption" sx={{ color: '#999' }}>Special Event</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          width: '16px', 
                          height: '3px', 
                          backgroundColor: 'rgba(255, 87, 34, 0.7)',
                          mr: 1
                        }} />
                        <Typography variant="caption" sx={{ color: '#999' }}>Limited Availability</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Footer with Submit Button */}
            <Box 
              sx={{ 
                mt: 4, 
                display: 'flex', 
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center' 
              }}
            >
              {showConfirmation ? (
                <Box 
                  sx={{ 
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    p: 2,
                    borderRadius: '8px',
                    border: '1px solid rgba(46, 125, 50, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    maxWidth: '500px',
                    width: '100%',
                    mb: 2
                  }}
                >
                  <CheckCircleIcon sx={{ color: '#66bb6a', mr: 2 }} />
                  <Typography variant="body2" sx={{ color: '#66bb6a' }}>
                    Thank you! Your reservation request has been submitted. We'll confirm shortly via SMS.
                  </Typography>
                </Box>
              ) : (
                <Button 
                  variant="contained" 
                  onClick={handleSubmit}
                  disabled={!selectedDay || !timeSlot}
                  sx={{ 
                    py: 1.5, 
                    px: 6, 
                    mb: 2,
                    backgroundColor: '#d38236',
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: '#b05e1d',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 12px rgba(0,0,0,0.3)'
                    },
                    transition: 'all 0.3s ease',
                    '&.Mui-disabled': {
                      backgroundColor: '#555',
                      color: '#999'
                    }
                  }}
                >
                  RESERVE NOW
                </Button>
              )}
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  p: 1.5,
                  px: 3,
                  borderRadius: '50px'
                }}
              >
                <InfoIcon sx={{ color: '#d38236', fontSize: 20 }} />
                <Typography 
                  variant="body2" 
                  sx={{ color: '#aaa' }}
                >
                  Need help? Call us at (555) 123-4567 for immediate assistance.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ReservationsPage;