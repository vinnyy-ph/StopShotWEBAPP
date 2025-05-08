// admin/components/dialogs/AddReservationDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Grid,
  TextField,
  MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
  const [newReservation, setNewReservation] = useState({
    guest_name: '',
    guest_phone: '',
    reservation_date: '',
    reservation_time: '',
    number_of_guests: 1,
    special_requests: '',
    status: 'PENDING'
  });

  const handleAddReservation = async () => {
    const success = await onAdd(newReservation);
    if (success) {
      setNewReservation({
        guest_name: '',
        guest_phone: '',
        reservation_date: '',
        reservation_time: '',
        number_of_guests: 1,
        special_requests: '',
        status: 'PENDING'
      });
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Customer Name"
              fullWidth
              value={newReservation.guest_name}
              onChange={(e) => setNewReservation({ ...newReservation, guest_name: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              fullWidth
              value={newReservation.guest_phone}
              onChange={(e) => setNewReservation({ ...newReservation, guest_phone: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date"
              type="date"
              fullWidth
              value={newReservation.reservation_date}
              onChange={(e) => setNewReservation({ ...newReservation, reservation_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Time"
              type="time"
              fullWidth
              value={newReservation.reservation_time}
              onChange={(e) => setNewReservation({ ...newReservation, reservation_time: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Number of Guests"
              type="number"
              fullWidth
              value={newReservation.number_of_guests}
              onChange={(e) => setNewReservation({ ...newReservation, number_of_guests: parseInt(e.target.value) })}
              InputProps={{
                inputProps: { min: 1 }
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Status"
              select
              fullWidth
              value={newReservation.status}
              onChange={(e) => setNewReservation({ ...newReservation, status: e.target.value })}
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="CONFIRMED">Confirmed</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Special Requests"
              fullWidth
              multiline
              rows={3}
              value={newReservation.special_requests}
              onChange={(e) => setNewReservation({ ...newReservation, special_requests: e.target.value })}
            />
          </Grid>
        </Grid>
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