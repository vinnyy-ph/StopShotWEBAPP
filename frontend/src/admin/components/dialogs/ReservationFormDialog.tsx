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
  CircularProgress,
  SelectChangeEvent,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CloseIcon from '@mui/icons-material/Close';
import { Reservation } from '../dashboard';
import { format, parse, isBefore, startOfDay, set } from 'date-fns';

// Update to match backend model
interface Room {
  id: number;
  room_name: string;
  room_description?: string;
  room_can_be_booked: boolean;
  max_number_of_people: number;
  room_type: string;
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
  // Add a new state to detect if this dialog is being used for confirmation
  const isConfirmationFlow = reservation?.status !== 'CONFIRMED' && mode === 'edit';
  
  // Check if the reservation is in a final state (confirmed or cancelled)
  const isInFinalState = reservation?.status === 'CONFIRMED' || reservation?.status === 'CANCELLED';
  
  // Updated form data structure to match API
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    reservation_date: new Date(),
    reservation_time: new Date(),
    duration: '01:00:00', // Default 1 hour
    number_of_guests: 1,
    special_requests: '',
    status: 'PENDING',
    room_id: '',
    room_type: 'TABLE'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Convert frontend room type to backend format
  const normalizeRoomType = (roomType: string): string => {
    if (roomType === "Table" || roomType === "TABLE") {
      return "TABLE";
    }
    if (roomType === "Karaoke Room" || roomType === "KARAOKE_ROOM") {
      return "KARAOKE_ROOM";
    }
    return roomType;
  };

  // Convert backend room type to display format
  const displayRoomType = (roomType: string): string => {
    if (roomType === "TABLE") {
      return "Table";
    }
    if (roomType === "KARAOKE_ROOM") {
      return "Karaoke Room";
    }
    return roomType;
  };

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

      // Normalize the room_type to ensure it matches backend format
      const normalizedRoomType = normalizeRoomType(reservation.room_type || 'TABLE');

      setFormData({
        guest_name: reservation.guest_name || '',
        guest_email: reservation.guest_email || '',
        reservation_date: new Date(reservation.reservation_date),
        reservation_time: timeDate,
        duration: reservation.duration || '01:00:00',
        number_of_guests: reservation.number_of_guests || 1,
        special_requests: reservation.special_requests || '',
        status: reservation.status || 'PENDING',
        room_id: reservation.room?.id?.toString() || '',
        room_type: normalizedRoomType
      });
    } else {
      // Default values for new reservation
      const now = new Date();
      const startTime = new Date();
      startTime.setHours(16, 0, 0, 0); // Default to 4:00 PM
      
      setFormData({
        guest_name: '',
        guest_email: '',
        reservation_date: now,
        reservation_time: startTime,
        duration: '01:00:00', // Default 1 hour
        number_of_guests: 1,
        special_requests: '',
        status: 'PENDING',
        room_id: '',
        room_type: 'TABLE'
      });
    }
  }, [reservation, open, mode]);

  // Determine if the form should be read-only based on status
  const isReadOnly = mode === 'edit' && isInFinalState;

  // Update the title logic
  const getDialogTitle = () => {
    if (isReadOnly) {
      return 'View Reservation';
    }
    if (isConfirmationFlow) {
      return 'Assign Room to Confirm Reservation';
    }
    return mode === 'add' ? 'Add New Reservation' : 'Edit Reservation';
  }
  
  // Update the button text logic
  const getSaveButtonText = () => {
    if (isReadOnly) {
      return 'Close';
    }
    if (isConfirmationFlow) {
      return 'Assign Room & Confirm';
    }
    return mode === 'add' ? 'Create Reservation' : 'Save Changes';
  }

  // Validate that a room is selected if in confirmation flow
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.guest_name.trim()) {
      newErrors.guest_name = 'Name is required';
    }
    
    if (!formData.guest_email.trim()) {
      newErrors.guest_email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.guest_email)) {
      newErrors.guest_email = 'Invalid email format';
    }
    
    // Date in the past validation - skip for edit mode
    if (mode === 'add' && isBefore(formData.reservation_date, startOfDay(new Date()))) {
      newErrors.reservation_date = 'Date cannot be in the past';
    }
    
    // Remove time validation check
    // const hours = formData.reservation_time.getHours();
    // if (!(hours >= 16 || hours < 1)) {
    //   newErrors.reservation_time = 'Time must be between 4:00 PM and 1:00 AM';
    // }
    
    if (formData.number_of_guests < 1) {
      newErrors.number_of_guests = 'Must have at least 1 guest';
    }
    
    // Add validation for room assignment if status is being set to CONFIRMED
    if (formData.status === 'CONFIRMED' && !formData.room_id) {
      newErrors.room_id = 'Room must be assigned before confirming';
      newErrors.status = 'Cannot confirm without assigning a room';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isReadOnly) return;
    
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    if (isReadOnly) return;
    
    const name = e.target.name as string;
    const value = e.target.value;
    
    if (name === 'status' && value === 'CONFIRMED' && !formData.room_id) {
      // If trying to set status to CONFIRMED without a room assigned
      setErrors(prev => ({ 
        ...prev, 
        status: 'Cannot confirm without assigning a room',
        room_id: 'Room assignment required for confirmation'
      }));
      return; // Don't update the status
    }
    
    // Update the form data
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSubmit = async () => {
    // If in read-only mode, just close the dialog
    if (isReadOnly) {
      onClose();
      return;
    }
    
    if (validateForm()) {
      // Format the date and time
      const formattedDate = format(formData.reservation_date, 'yyyy-MM-dd');
      const formattedTime = format(formData.reservation_time, 'HH:mm:ss');
      
      const reservationData = {
        guest_name: formData.guest_name,
        guest_email: formData.guest_email,
        reservation_date: formattedDate,
        reservation_time: formattedTime,
        duration: formData.duration,
        number_of_guests: formData.number_of_guests,
        special_requests: formData.special_requests,
        status: formData.status,
        room_id: formData.room_id || null,
        // Keep the original room_type, don't modify it
        room_type: reservation?.room_type || formData.room_type,
        id: mode === 'edit' && reservation ? reservation.id : undefined
      };
      
      const success = await onSave(reservationData);
      if (success) {
        onClose();
      }
    }
  };

  // Get available room options based on the room type
  const getAvailableRooms = () => {
    const normalizedRoomType = normalizeRoomType(formData.room_type);
    return rooms.filter(room => room.room_type === normalizedRoomType);
  };

  // Helper function to restrict time picker to 4pm-1am
  const shouldDisableTime = (date: Date) => {
    const hours = date.getHours();
    // Explicitly specify which hours are valid (4pm-1am)
    const validHours = [16, 17, 18, 19, 20, 21, 22, 23, 0, 1]; // 4pm-11pm, 12am, 1am
    return !validHours.includes(hours);
  };

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
        <Typography variant="h6">{getDialogTitle()}</Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {isReadOnly && (
          <Alert severity="info" sx={{ mb: 3 }}>
            This reservation is {reservation?.status.toLowerCase()} and cannot be edited.
          </Alert>
        )}
        
        {isConfirmationFlow && (
          <Alert severity="info" sx={{ mb: 3 }}>
            This reservation requires a room assignment before it can be confirmed.
          </Alert>
        )}
        
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
                helperText={errors.guest_name || (mode === 'edit' ? 'Guest name cannot be changed' : '')}
                required
                variant="outlined"
                InputProps={{
                  readOnly: mode === 'edit', // Read-only in edit mode
                }}
                disabled={mode === 'edit'}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="guest_email"
                type="email"
                value={formData.guest_email}
                onChange={handleInputChange}
                error={!!errors.guest_email}
                helperText={errors.guest_email || (mode === 'edit' ? 'Email cannot be changed' : '')}
                required
                variant="outlined"
                InputProps={{
                  readOnly: mode === 'edit', // Read-only in edit mode
                }}
                disabled={mode === 'edit'}
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
                InputProps={{
                  readOnly: isReadOnly,
                }}
                disabled={isReadOnly}
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
                  if (isReadOnly) return;
                  if (date) {
                    setFormData(prev => ({ ...prev, reservation_date: date }));
                    if (errors.reservation_date) {
                      setErrors(prev => ({ ...prev, reservation_date: '' }));
                    }
                  }
                }}
                minDate={mode === 'add' ? new Date() : undefined}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    variant: "outlined",
                    error: !!errors.reservation_date,
                    helperText: errors.reservation_date,
                    InputProps: {
                      readOnly: isReadOnly,
                    },
                    disabled: isReadOnly
                  }
                }}
                disabled={isReadOnly}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TimePicker
                label="Reservation Time"
                value={formData.reservation_time}
                onChange={(time) => {
                  if (isReadOnly) return;
                  if (time) {
                    // Accept any time without validation
                    setFormData(prev => ({ ...prev, reservation_time: time }));
                    if (errors.reservation_time) {
                      setErrors(prev => ({ ...prev, reservation_time: '' }));
                    }
                  }
                }}
                // Remove the time constraint 
                // shouldDisableTime={shouldDisableTime}
                ampm={true}
                views={['hours', 'minutes']}
                minutesStep={15}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    variant: "outlined",
                    error: !!errors.reservation_time,
                    helperText: "Select any time for now", // Changed helper text
                    InputProps: {
                      readOnly: isReadOnly,
                    },
                    disabled: isReadOnly
                  }
                }}
                disabled={isReadOnly}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required disabled={isReadOnly}>
                <InputLabel>Duration</InputLabel>
                <Select
                  name="duration"
                  value={formData.duration}
                  onChange={handleSelectChange}
                  label="Duration"
                  readOnly={isReadOnly}
                >
                  <MenuItem value="01:00:00">1 hour</MenuItem>
                  <MenuItem value="01:30:00">1.5 hours</MenuItem>
                  <MenuItem value="02:00:00">2 hours</MenuItem>
                  <MenuItem value="03:00:00">3 hours</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              {/* Display room type as read-only field */}
              <TextField
                fullWidth
                label="Room Type"
                value={displayRoomType(formData.room_type)}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
                disabled
                helperText="Room type cannot be changed"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required={isConfirmationFlow || formData.status === 'CONFIRMED'} error={!!errors.room_id} disabled={isReadOnly}>
                <InputLabel>Room Assignment</InputLabel>
                <Select
                  name="room_id"
                  value={formData.room_id}
                  onChange={handleSelectChange}
                  label="Room Assignment"
                  readOnly={isReadOnly}
                >
                  <MenuItem value="">
                    <em>Unassigned</em>
                  </MenuItem>
                  {getAvailableRooms().map((room) => (
                    <MenuItem key={room.id} value={room.id.toString()}>
                      {room.room_name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.room_id && <FormHelperText>{errors.room_id}</FormHelperText>}
                {!errors.room_id && formData.status === 'CONFIRMED' && 
                  <FormHelperText>Room assignment is required for confirmed reservations</FormHelperText>
                }
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.status} disabled={isReadOnly}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  label="Status"
                  readOnly={isReadOnly}
                >
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </Select>
                {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
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
                InputProps={{
                  readOnly: mode === 'edit', // Read-only in edit mode
                }}
                disabled={mode === 'edit'}
                helperText={mode === 'edit' ? 'Special requests cannot be changed' : ''}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button 
          onClick={onClose} 
          color="inherit"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading || (formData.status === 'CONFIRMED' && !formData.room_id)}
          sx={{
            bgcolor: '#d38236',
            '&:hover': {
              bgcolor: '#b05e1d'
            }
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : getSaveButtonText()}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationFormDialog;