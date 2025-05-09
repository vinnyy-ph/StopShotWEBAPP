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
  MenuItem,
  CircularProgress,
  FormHelperText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AddEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (employee: any) => Promise<boolean>;
}

const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({
  open,
  onClose,
  onAdd
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [newEmployee, setNewEmployee] = useState({
    first_name: '',
    last_name: '',
    phone_number: '', // Changed from phone_num to match expected API field
    role: 'BARTENDER',
    hire_date: new Date().toISOString().split('T')[0], // Default to today
    is_active: true
  });

  // Validate Philippine phone number format
  const validatePhoneNumber = (phone: string) => {
    // Allow empty phone number
    if (!phone) return true;
    
    // Check for valid Philippine phone number formats
    const mobilePattern = /^(09\d{9}|(\+)?639\d{9})$/;
    return mobilePattern.test(phone);
  };

  // Format phone number as needed
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    
    // Remove any non-numeric characters except leading +
    let formatted = phone.replace(/[^\d+]/g, '');
    
    // If it starts with 0, keep as is
    if (formatted.startsWith('0')) {
      return formatted.substring(0, 11); // Limit to 11 digits (09XXXXXXXXX)
    }
    
    // If it starts with +63, keep as is
    if (formatted.startsWith('+63')) {
      return formatted.substring(0, 13); // Limit to 13 digits (+639XXXXXXXXX)
    }
    
    // If it starts with 63, add the +
    if (formatted.startsWith('63')) {
      return '+' + formatted.substring(0, 12); // Limit to 13 digits (+639XXXXXXXXX)
    }
    
    // If it's just the 9 digits, add the 0
    if (formatted.length === 9 && /^\d{9}$/.test(formatted)) {
      return '09' + formatted;
    }
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatPhoneNumber(rawValue);
    
    setNewEmployee({ ...newEmployee, phone_number: formattedValue });
    
    if (formattedValue && !validatePhoneNumber(formattedValue)) {
      setPhoneError('Enter a valid Philippine phone number (09XXXXXXXXX or +639XXXXXXXXX)');
    } else {
      setPhoneError('');
    }
  };

  const handleAddEmployee = async () => {
    // Validate required fields
    if (!newEmployee.first_name || !newEmployee.last_name) {
      setError('First name and last name are required');
      return;
    }

    // Validate phone number if provided
    if (newEmployee.phone_number && !validatePhoneNumber(newEmployee.phone_number)) {
      setPhoneError('Enter a valid Philippine phone number (09XXXXXXXXX or +639XXXXXXXXX)');
      return;
    }

    setError('');
    setLoading(true);
    try {
      // Create a payload that matches what the backend expects
      const payload = {
        first_name: newEmployee.first_name,
        last_name: newEmployee.last_name,
        phone_num: newEmployee.phone_number || null, // Allow null for empty phone
        role: newEmployee.role,
        hire_date: newEmployee.hire_date,
        is_active: newEmployee.is_active
      };

      const success = await onAdd(payload);
      if (success) {
        // Reset the form
        setNewEmployee({
          first_name: '',
          last_name: '',
          phone_number: '',
          role: 'BARTENDER',
          hire_date: new Date().toISOString().split('T')[0],
          is_active: true
        });
        onClose(); // Ensure the dialog closes
      } else {
        setError('Failed to add employee. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while adding the employee.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="add-employee-dialog"
    >
      <DialogTitle className="dialog-title">
        Add New Employee
        <IconButton
          onClick={onClose}
          size="small"
          className="dialog-close"
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="dialog-content">
        {error && (
          <div style={{ color: 'red', marginBottom: 16 }}>
            {error}
          </div>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name *"
              fullWidth
              value={newEmployee.first_name}
              onChange={(e) => setNewEmployee({ ...newEmployee, first_name: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name *"
              fullWidth
              value={newEmployee.last_name}
              onChange={(e) => setNewEmployee({ ...newEmployee, last_name: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              fullWidth
              value={newEmployee.phone_number}
              onChange={handlePhoneChange}
              error={Boolean(phoneError)}
              placeholder="09XXXXXXXXX or +639XXXXXXXXX"
              helperText={phoneError || "Philippine mobile format required"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Hire Date"
              type="date"
              fullWidth
              value={newEmployee.hire_date}
              onChange={(e) => setNewEmployee({ ...newEmployee, hire_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Role"
              select
              fullWidth
              value={newEmployee.role}
              onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
            >
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="OWNER">Owner</MenuItem>
              <MenuItem value="BAR_MANAGER">Bar Manager</MenuItem>
              <MenuItem value="HEAD_CHEF">Head Chef</MenuItem>
              <MenuItem value="BARTENDER">Bartender</MenuItem>
              <MenuItem value="SERVER">Server</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button 
          onClick={onClose} 
          className="dialog-btn cancel-btn"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          variant="contained"
          className="dialog-btn confirm-btn"
          onClick={handleAddEmployee}
          disabled={loading || Boolean(phoneError)}
        >
          {loading ? <CircularProgress size={24} /> : 'Add Employee'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeDialog;