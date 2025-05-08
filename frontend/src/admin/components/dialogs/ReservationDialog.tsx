import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  IconButton,
  Divider,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import GroupIcon from '@mui/icons-material/Group';
import ChairIcon from '@mui/icons-material/Chair';
import NoteIcon from '@mui/icons-material/Note';
import { Reservation } from '../dashboard';
import { format } from 'date-fns';

interface ReservationDialogProps {
  open: boolean;
  reservation: Reservation | null;
  onClose: () => void;
  onEdit: () => void;
}

const ReservationDialog: React.FC<ReservationDialogProps> = ({
  open,
  reservation,
  onClose,
  onEdit
}) => {
  if (!reservation) return null;
  
  // Format the date for better readability
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  // Format the time
  const formatTime = (timeString: string) => {
    try {
      if (timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':');
        const hourNum = parseInt(hours, 10);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const hour12 = hourNum % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
      }
      return timeString;
    } catch (e) {
      return timeString;
    }
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
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
        className="dialog-title"
        sx={{ 
          bgcolor: '#d38236',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 2
        }}
      >
        <Typography variant="h6">Reservation Details</Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent 
        sx={{
          p: 3,
          color: theme => theme.palette.mode === 'dark' ? '#fff' : '#333'
        }}
      >
        {/* Status Chip */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip 
            label={reservation.status} 
            color={getStatusColor(reservation.status) as any}
            variant="outlined"
            sx={{ 
              fontWeight: 600,
              px: 1,
              borderWidth: '2px'
            }}
          />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Reservation #{reservation.id}
          </Typography>
        </Box>
        
        {/* Main info in a paper container */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 2, 
            mb: 3, 
            backgroundColor: theme => 
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' 
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box mb={2} display="flex" alignItems="center">
                <PersonIcon sx={{ mr: 1, color: '#d38236' }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Customer Name</Typography>
                  <Typography variant="h6">{reservation.guest_name}</Typography>
                </Box>
              </Box>
              
              <Box mb={2} display="flex" alignItems="center">
                <PhoneIcon sx={{ mr: 1, color: '#d38236' }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1">{reservation.guest_phone || 'Not provided'}</Typography>
                </Box>
              </Box>
              
              <Box mb={2} display="flex" alignItems="center">
                <GroupIcon sx={{ mr: 1, color: '#d38236' }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Guests</Typography>
                  <Typography variant="body1">{reservation.number_of_guests}</Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box mb={2} display="flex" alignItems="center">
                <EventIcon sx={{ mr: 1, color: '#d38236' }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                  <Typography variant="body1">{formatDate(reservation.reservation_date)}</Typography>
                </Box>
              </Box>
              
              <Box mb={2} display="flex" alignItems="center">
                <AccessTimeIcon sx={{ mr: 1, color: '#d38236' }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Time</Typography>
                  <Typography variant="body1">{formatTime(reservation.reservation_time)}</Typography>
                </Box>
              </Box>
              
              <Box mb={2} display="flex" alignItems="center">
                <ChairIcon sx={{ mr: 1, color: '#d38236' }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Table Type</Typography>
                  <Typography variant="body1">
                    {reservation.room?.room_name || 'Unassigned'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
          
        {/* Special Requests section */}
        {reservation.special_requests && (
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              mb: 3, 
              backgroundColor: theme => 
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' 
            }}
          >
            <Box mb={1} display="flex" alignItems="center">
              <NoteIcon sx={{ mr: 1, color: '#d38236' }} />
              <Typography variant="subtitle2" color="text.secondary">Special Requests</Typography>
            </Box>
            <Typography variant="body1" sx={{ mt: 1, pl: 4 }}>
              {reservation.special_requests}
            </Typography>
          </Paper>
        )}
          
        {/* Created/Updated info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            Created: {reservation.created_at ? formatDate(reservation.created_at) : 'N/A'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Last Updated: {reservation.updated_at ? formatDate(reservation.updated_at) : 'N/A'}
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions 
        sx={{ 
          p: 2,
          bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'
        }}
      >
        <Button onClick={onClose} color="inherit">Close</Button>
        <Button 
          onClick={onEdit} 
          variant="contained" 
          startIcon={<EditIcon />}
          sx={{
            bgcolor: '#d38236',
            '&:hover': {
              bgcolor: '#b05e1d'
            }
          }}
        >
          Edit Reservation
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationDialog;