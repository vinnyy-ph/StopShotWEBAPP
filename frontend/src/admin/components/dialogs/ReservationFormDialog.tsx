import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CloseIcon from '@mui/icons-material/Close';
import { Reservation } from '../dashboard';
import { format, parse } from 'date-fns';

interface Room {
  id: number;
  room_name: string;
  max_number_of_people: number;
}

interface ReservationFormDialogProps {
  open: boolean;
  reservation?: Reservation | null;
  onClose: () => void;
  onSave: (reservationData: any) => Promise<boolean>;
  rooms: Room[];
  isLoading?: boolean;
  mode: 'add' | 'edit';
}

const ReservationFormDialog: React.FC<ReservationFormDialogProps> = ({
  open,
  reservation,
  onClose,
  onSave,
  rooms,
  isLoading = false,
  mode
}) => {
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_phone: '',
    reservation_date: new Date(),
    reservation_time: new Date(),
    number_of_guests: 1,
    special_requests: '',
    status: 'PENDING',
    room_id: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when reservation changes
  useEffect(() => {
    if (reservation && mode === 'edit') {
      const timeString = reservation.reservation_time;
      let timeDate;
      
      try {
        // Try to parse the time (could be in different formats)
        if (timeString.includes(':')) {
          const [hours, minutes] = timeString.split(':').map(Number);
          timeDate = new Date();
          timeDate.setHours(hours);
          timeDate.setMinutes(minutes);
          timeDate.setSeconds(0);
        } else {
          timeDate = new Date(`1970-01-01T${timeString}`);
        }
      } catch (e) {
        timeDate = new Date();
      }

      setFormData({
        guest_name: reservation.guest_name || '',
        guest_phone: reservation.guest_phone || '',
        reservation_date: new Date(reservation.reservation_date),
        reservation_time: timeDate,
        number_of_guests: reservation.number_of_guests || 1,
        special_requests: reservation.special_requests || '',
        status: reservation.status || 'PENDING',
        room_id: reservation.room?.id || ''
      });
    } else {
      // Default values for new reservation
      const now = new Date();
      const startTime = new Date();
      startTime.setHours(18, 0, 0, 0); // Default to 6:00 PM
      
      setFormData({
        guest_name: '',
        guest_phone: '',
        reservation_date: now,
        reservation_time: startTime,
        number_of_guests: 1,
        special_requests: '',
        status: 'PENDING',
        room_id: ''
      });
    }
  }, [reservation, open, mode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.guest_name.trim()) {
      newErrors.guest_name = 'Name is required';
    }
    
    if (!formData.guest_phone.trim()) {
      newErrors.guest_phone = 'Phone number is required';
    }
    
    if (formData.number_of_guests < 1) {
      newErrors.number_of_guests = 'Must have at least 1 guest';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async () => {
    if (validateForm()) {
      // Format the date and time
      const formattedDate = format(formData.reservation_date, 'yyyy-MM-dd');
      const formattedTime = format(formData.reservation_time, 'HH:mm:ss');
      
      const reservationData = {
        ...formData,
        reservation_date: formattedDate,
        reservation_time: formattedTime,
        id: mode === 'edit' && reservation ? reservation.id : undefined
      };
      
      const success = await onSave(reservationData);
      if (success) {
        onClose();
      }
    }
  };

  const title = mode === 'add' ? 'Add New Reservation' : 'Edit Reservation';
  const saveButtonText = mode === 'add' ? 'Create Reservation' : 'Save Changes';

  return (
    <Dialog 
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: theme => theme.palette.mode === 'dark' ? '#262626' : '#fff',
          borderRadius: '10px',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: '#d38236',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 2
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            {/* Guest Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Guest Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Guest Name"
                name="guest_name"
                value={formData.guest_name}
                onChange={handleInputChange}
                error={!!errors.guest_name}
                helperText={errors.guest_name}
                required
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="guest_phone"
                value={formData.guest_phone}
                onChange={handleInputChange}
                error={!!errors.guest_phone}
                helperText={errors.guest_phone}
                required
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Number of Guests"
                name="number_of_guests"
                type="number"
                value={formData.number_of_guests}
                onChange={handleInputChange}
                error={!!errors.number_of_guests}
                helperText={errors.number_of_guests}
                inputProps={{ min: 1 }}
                required
                variant="outlined"
              />
            </Grid>
            
            {/* Reservation Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 2 }}>
                Reservation Details
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Reservation Date"
                value={formData.reservation_date}
                onChange={(date) => {
                  if (date) {
                    setFormData(prev => ({ ...prev, reservation_date: date }));
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    variant: "outlined"
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TimePicker
                label="Reservation Time"
                value={formData.reservation_time}
                onChange={(time) => {
                  if (time) {
                    setFormData(prev => ({ ...prev, reservation_time: time }));
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    variant: "outlined"
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Room Type</InputLabel>
                <Select
                  name="room_id"
                  value={formData.room_id}
                  onChange={handleSelectChange}
                  label="Room Type"
                >
                  <MenuItem value="">
                    <em>Unassigned</em>
                  </MenuItem>
                  {rooms.map((room) => (
                    <MenuItem key={room.id} value={room.id}>
                      {room.room_name} (Max: {room.max_number_of_people})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  label="Status"
                >
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Special Requests"
                name="special_requests"
                value={formData.special_requests}
                onChange={handleInputChange}
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)' }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
          sx={{
            bgcolor: '#d38236',
            '&:hover': {
              bgcolor: '#b05e1d'
            }
          }}
        >
          {isLoading ? 'Processing...' : saveButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationFormDialog;