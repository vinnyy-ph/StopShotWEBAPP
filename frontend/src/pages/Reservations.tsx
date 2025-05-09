import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  TableCell
} from '@mui/material';
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
import MicIcon from '@mui/icons-material/Mic';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailIcon from '@mui/icons-material/Email';
import '../styles/pages/reservations.css';
import { Reservation, getStatusDisplay, getRoomTypeDisplay } from '../dashboard';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Availability types
interface DayAvailability {
  isAvailable: boolean;
  isBusy: boolean;
  isSpecialEvent: boolean;
}

// Form data
interface ReservationFormData {
  guest_name: string;
  guest_email: string;
  reservation_date: string;
  reservation_time: string;
  duration: string;
  number_of_guests: number;
  room_type: string;
  special_requests: string;
}

const ReservationsPage: React.FC = () => {
  // Basic state
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [reservationType, setReservationType] = useState('table');
  const [timeSlot, setTimeSlot] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<ReservationFormData>({
    guest_name: '',
    guest_email: '',
    reservation_date: '',
    reservation_time: '',
    duration: '01:00:00', // Default 1 hour
    number_of_guests: 1,
    room_type: 'TABLE', // Default to TABLE type
    special_requests: ''
  });
  
  // Availability state
  const [isLoading, setIsLoading] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [dayAvailability, setDayAvailability] = useState<{[key: number]: DayAvailability}>({});
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calculate days in month
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);
  const daysOfWeek = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  const blankDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  // Fetch month availability when month/year changes
  useEffect(() => {
    fetchMonthAvailability();
  }, [currentMonth, currentYear, reservationType]);
  
  // Fetch time slots when day is selected
  useEffect(() => {
    if (selectedDay) {
      fetchTimeSlotAvailability();
    } else {
      setAvailableTimeSlots([]);
      setTimeSlot('');
    }
  }, [selectedDay]);

  // Fetch month availability from API
  const fetchMonthAvailability = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/reservations/availability/`, { 
        params: { 
          year: currentYear, 
          month: currentMonth + 1,
          reservation_type: reservationType
        }
      });
      
      setDayAvailability(response.data);
    } catch (error) {
      console.error('Error fetching availability:', error);
      
      // Fallback mock data for development
      const mockAvailability: {[key: number]: DayAvailability} = {};
      const busyDays = [5, 12, 19, 25];
      const specialEventDays = [8, 15, 22];
      
      daysInMonth.forEach(day => {
        mockAvailability[day] = {
          isAvailable: true,
          isBusy: busyDays.includes(day),
          isSpecialEvent: specialEventDays.includes(day)
        };
      });
      
      setDayAvailability(mockAvailability);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch available time slots for selected date
  const fetchTimeSlotAvailability = async () => {
    if (!selectedDay) return;
    
    setIsLoading(true);
    try {
      const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      
      const response = await axios.get(`${API_BASE_URL}/reservations/timeslots/`, { 
        params: { 
          date: date,
          reservation_type: reservationType
        }
      });
      
      setAvailableTimeSlots(response.data.available_slots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      
      // Fallback mock data
      const allTimeSlots = [
        '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', 
        '9:00 PM', '10:00 PM', '11:00 PM', '12:00 AM', '1:00 AM'
      ];
      
      const dayStatus = dayAvailability[selectedDay];
      let availableSlots = [...allTimeSlots];
      
      if (dayStatus?.isBusy) {
        availableSlots = availableSlots.filter((_, index) => index % 3 !== 0);
      }
      
      if (dayStatus?.isSpecialEvent) {
        availableSlots = availableSlots.filter((_, index) => index % 2 !== 0);
      }
      
      setAvailableTimeSlots(availableSlots);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };
  
  // Validate form before submission
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.guest_email.trim()) {
      errors.guest_email = 'Email is required';
    } else {
      // Basic email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.guest_email)) {
        errors.guest_email = 'Enter a valid email address';
      }
    }
    
    if (!formData.guest_name.trim()) {
      errors.guest_name = 'Name is required';
    }
    
    if (formData.number_of_guests < 1) {
      errors.number_of_guests = 'At least 1 guest is required';
    }
    
    if (!selectedDay) {
      errors.date = 'Please select a date';
    }
    
    if (!timeSlot) {
      errors.time = 'Please select a time slot';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReservationTypeChange = (type: string) => {
    setReservationType(type);
    setFormData({
      ...formData,
      room_type: type === 'table' ? 'TABLE' : 'KARAOKE_ROOM'
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const reservationDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      
      // Convert time format to 24-hour format that Django will accept
      let formattedTime = timeSlot;
      if (timeSlot) {
        const [time, period] = timeSlot.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        // Convert to 24-hour format
        if (period === 'PM' && hours !== 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }
        
        formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      }
      
      // Updated to match required API format
      const reservationData = {
        guest_name: formData.guest_name,
        guest_email: formData.guest_email,
        reservation_date: reservationDate,
        reservation_time: formattedTime,
        duration: formData.duration || '01:00:00',
        number_of_guests: formData.number_of_guests,
        room_type: formData.room_type,
        special_requests: formData.special_requests
      };
      
      // Submit to API
      await axios.post(`${API_BASE_URL}/reservations/`, reservationData);
      
      // Show confirmation
      setShowConfirmation(true);
    } catch (error: any) {
      console.error('Error submitting reservation:', error);
      
      // Add this to see the specific error message from the backend
      if (error.response) {
        console.log('Response data:', error.response.data);
      }
      
      // Handle validation errors from the backend
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        const formattedErrors: {[key: string]: string} = {};
        
        Object.keys(backendErrors).forEach(key => {
          formattedErrors[key] = Array.isArray(backendErrors[key]) 
            ? backendErrors[key][0] 
            : backendErrors[key];
        });
        
        setFormErrors(formattedErrors);
      } else {
        alert('Failed to submit reservation. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a day is marked as busy
  const isDayBusy = (day: number) => {
    return dayAvailability[day]?.isBusy || false;
  };

  // Check if a day has special events
  const isDaySpecialEvent = (day: number) => {
    return dayAvailability[day]?.isSpecialEvent || false;
  };
  
  // Check if a day is unavailable
  const isDayUnavailable = (day: number) => {
    return dayAvailability[day]?.isAvailable === false || false;
  };

  return (
    <Box className="reservations-page dark-theme" sx={{ py: 6, backgroundColor: '#121212' }}>
      <Container maxWidth="lg">
        {/* Header */}
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

        {/* Main Content */}
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
          {/* Top Accent Bar */}
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
                  onClick={() => handleReservationTypeChange('table')}
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
                  onClick={() => handleReservationTypeChange('karaoke')}
                  startIcon={<MicIcon />}
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

            {/* Main Content Grid */}
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
                      borderColor: formErrors.guest_name ? '#f44336' : 'rgba(255,255,255,0.2)',
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: '#777',
                      opacity: 1
                    },
                    '& .error-text': {
                      color: '#f44336',
                      fontSize: '0.75rem',
                      marginTop: '-12px',
                      marginBottom: '8px'
                    }
                  }}
                >
                  <TextField
                    variant="outlined"
                    placeholder="Enter your name"
                    fullWidth
                    name="guest_name"
                    value={formData.guest_name}
                    onChange={handleInputChange}
                    error={!!formErrors.guest_name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: formErrors.guest_name ? '#f44336' : '#d38236' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {formErrors.guest_name && <Typography className="error-text">{formErrors.guest_name}</Typography>}
                  
                  <TextField
                    variant="outlined"
                    placeholder="How many people?"
                    fullWidth
                    type="number"
                    name="number_of_guests"
                    value={formData.number_of_guests}
                    onChange={handleInputChange}
                    error={!!formErrors.number_of_guests}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GroupIcon sx={{ color: formErrors.number_of_guests ? '#f44336' : '#d38236' }} />
                        </InputAdornment>
                      ),
                      inputProps: { min: 1 }
                    }}
                  />
                  {formErrors.number_of_guests && <Typography className="error-text">{formErrors.number_of_guests}</Typography>}
                  
                  <TextField
                    variant="outlined"
                    placeholder="Enter your email address"
                    fullWidth
                    type="email"
                    name="guest_email"
                    value={formData.guest_email}
                    onChange={handleInputChange}
                    error={!!formErrors.guest_email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: formErrors.guest_email ? '#f44336' : '#d38236' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {formErrors.guest_email && <Typography className="error-text">{formErrors.guest_email}</Typography>}
                  
                  <FormControl fullWidth error={!!formErrors.time}>
                    <Select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value as string)}
                      displayEmpty
                      disabled={!selectedDay}
                      renderValue={timeSlot !== '' ? undefined : () => "Select Time Slot"}
                      sx={{
                        '& .MuiSelect-icon': {
                          color: formErrors.time ? '#f44336' : '#d38236'
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: formErrors.time ? '#f44336' : 'rgba(255,255,255,0.2)',
                        }
                      }}
                      startAdornment={
                        <InputAdornment position="start">
                          <AccessTimeIcon sx={{ color: formErrors.time ? '#f44336' : '#d38236' }} />
                        </InputAdornment>
                      }
                    >
                      {!selectedDay ? (
                        <MenuItem disabled value="" sx={{ color: '#000' }}>
                          Please select a day first
                        </MenuItem>
                      ) : availableTimeSlots.length > 0 ? (
                        availableTimeSlots.map(time => (
                          <MenuItem key={time} value={time} sx={{ color: '#000' }}>
                            {time}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled value="" sx={{ color: '#000' }}>
                          No available time slots
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  {formErrors.time && <Typography className="error-text">{formErrors.time}</Typography>}
                  
                  <TextField
                    variant="outlined"
                    placeholder="MM/DD/YYYY"
                    fullWidth
                    error={!!formErrors.date}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventIcon sx={{ color: formErrors.date ? '#f44336' : '#d38236' }} />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    value={
                      selectedDay 
                        ? `${String(currentMonth + 1).padStart(2, '0')}/${
                            selectedDay < 10 ? '0' + selectedDay : selectedDay
                          }/${currentYear}`
                        : ''
                    }
                  />
                  {formErrors.date && <Typography className="error-text">{formErrors.date}</Typography>}

                  <TextField
                    variant="outlined"
                    placeholder="Special requests or notes"
                    fullWidth
                    multiline
                    rows={3}
                    name="special_requests"
                    value={formData.special_requests}
                    onChange={handleInputChange}
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
                  position: 'relative'
                }}>
                  {isLoading && (
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      zIndex: 2,
                      borderRadius: '12px',
                    }}>
                      <CircularProgress sx={{ color: '#d38236' }} />
                    </Box>
                  )}
                  
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
                      {months[currentMonth].toUpperCase()} {currentYear}
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
                        const isUnavailable = isDayUnavailable(day);
                        const isPastDate = new Date(currentYear, currentMonth, day) < new Date(new Date().setHours(0,0,0,0));
                        
                        return (
                          <Box
                            key={day}
                            onClick={() => {
                              if (!isUnavailable && !isPastDate) {
                                handleDayClick(day);
                              }
                            }}
                            sx={{
                              cursor: isUnavailable || isPastDate ? 'not-allowed' : 'pointer',
                              py: 1,
                              border: `1px solid ${selectedDay === day ? '#d38236' : '#333'}`,
                              borderRadius: '8px',
                              backgroundColor: 
                                isUnavailable || isPastDate ? 'rgba(50,50,50,0.3)' :
                                selectedDay === day ? 'rgba(211, 130, 54, 0.3)' : 
                                isSpecial ? 'rgba(211, 130, 54, 0.1)' :
                                'rgba(255,255,255,0.03)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                              transition: 'all 0.2s ease-in-out',
                              opacity: isUnavailable || isPastDate ? 0.5 : 1,
                              '&:hover': (!isUnavailable && !isPastDate) ? {
                                backgroundColor: selectedDay === day 
                                  ? 'rgba(211, 130, 54, 0.4)' 
                                  : 'rgba(211, 130, 54, 0.15)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
                              } : {}
                            }}
                            className={`calendar-day-box ${selectedDay === day ? 'selected-day' : ''}`}
                          >
                            <Typography
                              variant="body2" 
                              sx={{ 
                                fontWeight: selectedDay === day ? 700 : 400,
                                color: selectedDay === day ? '#d38236' : isUnavailable || isPastDate ? '#999' : '#fff',
                                fontSize: '1rem',
                                textDecoration: isPastDate ? 'line-through' : 'none'
                              }}
                            >
                              {day}
                            </Typography>
                            
                            {isBusy && !isUnavailable && !isPastDate && (
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
                            {isSpecial && !isUnavailable && !isPastDate && (
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
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          width: '10px', 
                          height: '10px', 
                          backgroundColor: 'rgba(50,50,50,0.5)',
                          borderRadius: '50%',
                          mr: 1
                        }} />
                        <Typography variant="caption" sx={{ color: '#999' }}>Unavailable</Typography>
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
                  disabled={isLoading}
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
                  {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'RESERVE NOW'}
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