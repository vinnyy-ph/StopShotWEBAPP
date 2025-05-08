// admin/components/dialogs/EmployeeDialog.tsx
import React from 'react';
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
  MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface EmployeeDialogProps {
  open: boolean;
  employee: any;
  editMode: boolean;
  onClose: () => void;
  onUpdate: (employee: any) => boolean;
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
  const handleUpdateEmployee = () => {
    if (!employee) return;
    
    const success = onUpdate(employee);
    if (success) {
      setEditMode(false);
      onClose();
    }
  };

  if (!employee) return null;

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
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="dialog-content">
        {editMode ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                fullWidth
                value={employee.name}
                onChange={(e) => employee.name = e.target.value}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Position"
                fullWidth
                value={employee.position}
                onChange={(e) => employee.position = e.target.value}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                value={employee.email}
                onChange={(e) => employee.email = e.target.value}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                fullWidth
                value={employee.phone}
                onChange={(e) => employee.phone = e.target.value}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hire Date"
                type="date"
                fullWidth
                value={employee.hireDate}
                onChange={(e) => employee.hireDate = e.target.value}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Status"
                select
                fullWidth
                value={employee.status}
                onChange={(e) => employee.status = e.target.value}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: '#d38236' }}>
                {employee.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6">{employee.name}</Typography>
                <Chip 
                  label={employee.status} 
                  size="small"
                  className={`status-chip ${employee.status === 'active' ? 'confirmed' : 'cancelled'}`}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Position</Typography>
              <Typography variant="body1" className="detail-value">{employee.position}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Employee ID</Typography>
              <Typography variant="body1" className="detail-value">#{employee.id}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Email</Typography>
              <Typography variant="body1" className="detail-value">{employee.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Phone</Typography>
              <Typography variant="body1" className="detail-value">{employee.phone}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Hire Date</Typography>
              <Typography variant="body1" className="detail-value">{employee.hireDate}</Typography>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button 
          onClick={onClose} 
          className="dialog-btn cancel-btn"
        >
          Cancel
        </Button>
        {editMode ? (
          <Button 
            variant="contained"
            className="dialog-btn confirm-btn"
            onClick={handleUpdateEmployee}
          >
            Save Changes
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