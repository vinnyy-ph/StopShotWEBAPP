// admin/components/dialogs/AddEmployeeDialog.tsx
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

interface AddEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (employee: any) => boolean;
}

const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({
  open,
  onClose,
  onAdd
}) => {
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    hireDate: '',
    status: 'active'
  });

  const handleAddEmployee = () => {
    const success = onAdd(newEmployee);
    if (success) {
      setNewEmployee({
        name: '',
        position: '',
        email: '',
        phone: '',
        hireDate: '',
        status: 'active'
      });
      onClose();
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
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="dialog-content">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              fullWidth
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Position"
              fullWidth
              value={newEmployee.position}
              onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              fullWidth
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              fullWidth
              value={newEmployee.phone}
              onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Hire Date"
              type="date"
              fullWidth
              value={newEmployee.hireDate}
              onChange={(e) => setNewEmployee({ ...newEmployee, hireDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Status"
              select
              fullWidth
              value={newEmployee.status}
              onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value })}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
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
          onClick={handleAddEmployee}
        >
          Add Employee
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeDialog;