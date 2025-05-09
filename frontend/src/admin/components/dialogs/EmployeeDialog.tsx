// admin/components/dialogs/EmployeeDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Grid,
  Typography,
  TextField,
  Avatar,
  Chip,
  MenuItem,
  Box,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Employee } from '../../components/dashboard';

interface EmployeeDialogProps {
  open: boolean;
  employee: Employee | null;
  editMode: boolean;
  onClose: () => void;
  onUpdate: (employee: any) => Promise<boolean>;
  setEditMode: (mode: boolean) => void;
}

const EmployeeDialog: React.FC<EmployeeDialogProps> = ({
  open,
  employee,
  editMode,
  onClose,
  onUpdate,
  setEditMode
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editedEmployee, setEditedEmployee] = useState<any>(null);
  
  // Update the editedEmployee when the employee prop changes
  React.useEffect(() => {
    if (employee) {
      setEditedEmployee({...employee});
    }
  }, [employee]);

  const handleUpdateEmployee = async () => {
    if (!editedEmployee) return;
    
    setLoading(true);
    setError('');
    try {
      const success = await onUpdate(editedEmployee);
      if (success) {
        setEditMode(false);
        onClose();
      } else {
        setError('Failed to update employee');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while updating the employee');
    } finally {
      setLoading(false);
    }
  };

  // Get employee full name
  const getEmployeeName = (emp: Employee) => {
    if (emp.first_name && emp.last_name) {
      return `${emp.first_name} ${emp.last_name}`;
    } else if (emp.first_name) {
      return emp.first_name;
    } else if (emp.username) {
      return emp.username;
    } else {
      return 'Unnamed Employee';
    }
  };

  // Get first letter for avatar
  const getAvatarInitial = (emp: Employee) => {
    if (emp.first_name) {
      return emp.first_name.charAt(0);
    } else if (emp.username) {
      return emp.username.charAt(0);
    } else {
      return 'E';
    }
  };

  if (!employee || !editedEmployee) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="employee-dialog"
    >
      <DialogTitle className="dialog-title">
        {editMode ? "Edit Employee" : "Employee Details"}
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
        {editMode ? (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                fullWidth
                value={editedEmployee.first_name || ""}
                onChange={(e) => setEditedEmployee({...editedEmployee, first_name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                fullWidth
                value={editedEmployee.last_name || ""}
                onChange={(e) => setEditedEmployee({...editedEmployee, last_name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                value={editedEmployee.email || ""}
                onChange={(e) => setEditedEmployee({...editedEmployee, email: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Username"
                fullWidth
                value={editedEmployee.username || ""}
                onChange={(e) => setEditedEmployee({...editedEmployee, username: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                fullWidth
                value={editedEmployee.phone_number || ""}
                onChange={(e) => setEditedEmployee({...editedEmployee, phone_num: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hire Date"
                type="date"
                fullWidth
                value={editedEmployee.hire_date || ""}
                onChange={(e) => setEditedEmployee({...editedEmployee, hire_date: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Role"
                select
                fullWidth
                value={editedEmployee.role || ""}
                onChange={(e) => setEditedEmployee({...editedEmployee, role: e.target.value})}
              >
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="OWNER">Owner</MenuItem>
                <MenuItem value="BAR_MANAGER">Bar Manager</MenuItem>
                <MenuItem value="HEAD_CHEF">Head Chef</MenuItem>
                <MenuItem value="BARTENDER">Bartender</MenuItem>
                <MenuItem value="SERVER">Server</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Status"
                select
                fullWidth
                value={editedEmployee.is_active}
                onChange={(e) => setEditedEmployee({...editedEmployee, is_active: e.target.value})}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: '#d38236' }}>
                {getAvatarInitial(employee)}
              </Avatar>
              <Box>
                <Typography variant="h6">{getEmployeeName(employee)}</Typography>
                <Chip 
                  label={employee.is_active ? 'active' : 'inactive'} 
                  size="small"
                  className={`status-chip ${employee.is_active ? 'confirmed' : 'cancelled'}`}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Role</Typography>
              <Typography variant="body1" className="detail-value">{employee.role}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Employee ID</Typography>
              <Typography variant="body1" className="detail-value">#{employee.user_id}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Username</Typography>
              <Typography variant="body1" className="detail-value">{employee.username}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Email</Typography>
              <Typography variant="body1" className="detail-value">{employee.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Phone</Typography>
              <Typography variant="body1" className="detail-value">{employee.phone_number || 'Not set'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Hire Date</Typography>
              <Typography variant="body1" className="detail-value">{employee.hire_date || 'Not set'}</Typography>
            </Grid>
            {employee.last_login_date && (
              <Grid item xs={12}>
                <Typography variant="subtitle2">Last Login</Typography>
                <Typography variant="body1" className="detail-value">
                  {employee.last_login_date} {employee.last_login_time && `at ${employee.last_login_time}`}
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button 
          onClick={onClose} 
          className="dialog-btn cancel-btn"
          disabled={loading}
        >
          Cancel
        </Button>
        {editMode ? (
          <Button 
            variant="contained"
            className="dialog-btn confirm-btn"
            onClick={handleUpdateEmployee}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        ) : (
          <Button 
            variant="contained"
            className="dialog-btn confirm-btn"
            onClick={() => setEditMode(true)}
          >
            Edit Employee
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeDialog;