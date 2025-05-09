// admin/components/dialogs/AddReservationDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import CloseIcon from '@mui/icons-material/Close';
import { format, isBefore, set, startOfDay } from 'date-fns';

interface AddReservationDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (reservation: any) => Promise<boolean>;
}

const AddReservationDialog: React.FC<AddReservationDialogProps> = ({
  open,
  onClose,
  onAdd
}) => {
  // Initialize with current date and time
  const now = new Date();
  const defaultTime = new Date();
  defaultTime.setHours(16, 0, 0, 0); // Default to 4:00 PM
  
  // Updated to match API requirements
  const [newReservation, setNewReservation] = useState({
    guest_name: '',
    guest_email: '',
    reservation_date: now,
    reservation_time: defaultTime,
    duration: '01:00:00',
    number_of_guests: 1,
    room_type: 'TABLE',
    special_requests: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      const now = new Date();
      const defaultTime = new Date();
      defaultTime.setHours(16, 0, 0, 0); // Default to 4:00 PM
      
      setNewReservation({
        guest_name: '',
        guest_email: '',
        reservation_date: now,
        reservation_time: defaultTime,
        duration: '01:00:00',
        number_of_guests: 1,
        room_type: 'TABLE',
        special_requests: ''
      });
      setErrors({});
    }
  }, [open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!newReservation.guest_name.trim()) {
      newErrors.guest_name = 'Name is required';
    }
    
    if (!newReservation.guest_email.trim()) {
      newErrors.guest_email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(newReservation.guest_email)) {
      newErrors.guest_email = 'Invalid email format';
    }
    
    // Date in the past validation
    if (isBefore(newReservation.reservation_date, startOfDay(new Date()))) {
      newErrors.reservation_date = 'Date cannot be in the past';
    }
    
    // Time range validation (4pm-1am)
    const hours = newReservation.reservation_time.getHours();
    if (!(hours >= 16 || hours < 1)) {
      newErrors.reservation_time = 'Time must be between 4:00 PM and 1:00 AM';
    }
    
    if (newReservation.number_of_guests < 1) {
      newErrors.number_of_guests = 'Must have at least 1 guest';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddReservation = async () => {
    if (validateForm()) {
      // Format date and time for API
      const formattedDate = format(newReservation.reservation_date, 'yyyy-MM-dd');
      const formattedTime = format(newReservation.reservation_time, 'HH:mm:ss');
      
      const reservationData = {
        guest_name: newReservation.guest_name,
        guest_email: newReservation.guest_email,
        reservation_date: formattedDate,
        reservation_time: formattedTime,
        duration: newReservation.duration,
        number_of_guests: newReservation.number_of_guests,
        room_type: newReservation.room_type,
        special_requests: newReservation.special_requests
      };
      
      const success = await onAdd(reservationData);
      if (success) {
        onClose();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReservation(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="add-reservation-dialog"
    >
      <DialogTitle className="dialog-title">
        Add New Reservation
        <IconButton
          onClick={onClose}
          size="small"
          className="dialog-close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="dialog-content">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Guest Name"
                name="guest_name"
                fullWidth
                value={newReservation.guest_name}
                onChange={handleInputChange}
                error={!!errors.guest_name}
                helperText={errors.guest_name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Guest Email"
                name="guest_email"
                type="email"
                fullWidth
                value={newReservation.guest_email}
                onChange={handleInputChange}
                error={!!errors.guest_email}
                helperText={errors.guest_email}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Reservation Date"
                value={newReservation.reservation_date}
                onChange={(date) => {
                  if (date) {
                    setNewReservation(prev => ({ ...prev, reservation_date: date }));
                    // Clear error when field is updated
                    if (errors.reservation_date) {
                      setErrors(prev => ({ ...prev, reservation_date: '' }));
                    }
                  }
                }}
                minDate={new Date()} // Ensure no past dates
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!errors.reservation_date,
                    helperText: errors.reservation_date
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TimePicker
                label="Reservation Time"
                value={newReservation.reservation_time}
                onChange={(time) => {
                  if (time) {
                    setNewReservation(prev => ({ ...prev, reservation_time: time }));
                    // Clear error when field is updated
                    if (errors.reservation_time) {
                      setErrors(prev => ({ ...prev, reservation_time: '' }));
                    }
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!errors.reservation_time,
                    helperText: errors.reservation_time
                  }
                }}
              />
              <FormHelperText>Business hours: 4:00 PM - 1:00 AM</FormHelperText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Duration</InputLabel>
                <Select
                  name="duration"
                  value={newReservation.duration}
                  label="Duration"
                  onChange={(e) => setNewReservation(prev => ({ ...prev, duration: e.target.value }))}
                >
                  <MenuItem value="01:00:00">1 hour</MenuItem>
                  <MenuItem value="01:30:00">1.5 hours</MenuItem>
                  <MenuItem value="02:00:00">2 hours</MenuItem>
                  <MenuItem value="03:00:00">3 hours</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Number of Guests"
                name="number_of_guests"
                type="number"
                fullWidth
                value={newReservation.number_of_guests}
                onChange={handleInputChange}
                error={!!errors.number_of_guests}
                helperText={errors.number_of_guests}
                InputProps={{
                  inputProps: { min: 1 }
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Room Type</InputLabel>
                <Select
                  name="room_type"
                  value={newReservation.room_type}
                  label="Room Type"
                  onChange={(e) => setNewReservation(prev => ({ ...prev, room_type: e.target.value }))}
                >
                  <MenuItem value="TABLE">Table</MenuItem>
                  <MenuItem value="KARAOKE_ROOM">Karaoke Room</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Special Requests"
                name="special_requests"
                fullWidth
                multiline
                rows={3}
                value={newReservation.special_requests}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button 
          onClick={onClose} 
          className="dialog-btn cancel-btn"
        >
          Cancel
        </Button>
        <Button 
          variant="contained"
          className="dialog-btn confirm-btn"
          onClick={handleAddReservation}
        >
          Add Reservation
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddReservationDialog;