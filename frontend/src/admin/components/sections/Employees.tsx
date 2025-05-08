// admin/components/sections/Employees.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SportsBarIcon from '@mui/icons-material/SportsBar';

import EmployeeDialog from '../dialogs/EmployeeDialog';
import AddEmployeeDialog from '../dialogs/AddEmployeeDialog';
import { mockEmployeesData } from '../dashboard';

interface EmployeesProps {
  employees: typeof mockEmployeesData;
  onAddEmployee: (employee: any) => boolean;
  onUpdateEmployee: (employee: any) => boolean;
  onDeleteEmployee: (id: number) => boolean;
}

const Employees: React.FC<EmployeesProps> = ({
  employees,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [employeeDialog, setEmployeeDialog] = useState(false);
  const [addEmployeeDialog, setAddEmployeeDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [employeeEditMode, setEmployeeEditMode] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenEmployeeDialog = (employee: any) => {
    setSelectedEmployee(employee);
    setEmployeeDialog(true);
    setEmployeeEditMode(false);
  };

  const handleCloseEmployeeDialog = () => {
    setEmployeeDialog(false);
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      key="employees"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Paper className="content-paper">
        <Box className="content-header">
          <Typography variant="h5" className="content-title">Employee Management</Typography>
          <Box className="content-actions">
            <TextField
              size="small"
              placeholder="Search employees"
              value={searchQuery}
              onChange={handleSearch}
              className="search-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="search-icon" />
                  </InputAdornment>
                ),
              }}
            />
            <IconButton size="small" className="filter-btn">
              <TuneIcon />
            </IconButton>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              className="add-btn"
              onClick={() => setAddEmployeeDialog(true)}
            >
              Add Employee
            </Button>
          </Box>
        </Box>

        {/* Employee Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Paper className="stats-card">
              <Box className="stats-header">
                <Typography className="stats-title">Total Employees</Typography>
                <WorkIcon className="stats-icon" />
              </Box>
              <Typography variant="h4" className="stats-value">{employees.length}</Typography>
              <Typography variant="body2" className="stats-trend positive">
                +2 from last month
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper className="stats-card">
              <Box className="stats-header">
                <Typography className="stats-title">Active Employees</Typography>
                <CheckCircleIcon className="stats-icon" />
              </Box>
              <Typography variant="h4" className="stats-value">
                {employees.filter(e => e.status === 'active').length}
              </Typography>
              <Typography variant="body2" className="stats-trend">
                {Math.round((employees.filter(e => e.status === 'active').length / employees.length) * 100)}% of total
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper className="stats-card">
              <Box className="stats-header">
                <Typography className="stats-title">Positions</Typography>
                <SportsBarIcon className="stats-icon" />
              </Box>
              <Typography variant="h4" className="stats-value">
                {new Set(employees.map(e => e.position)).size}
              </Typography>
              <Typography variant="body2" className="stats-trend">
                Different roles
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <TableContainer className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Hire Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id} className="table-row">
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: '#d38236' }}>
                        {employee.name.charAt(0)}
                      </Avatar>
                      {employee.name}
                    </Box>
                  </TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>{employee.hireDate}</TableCell>
                  <TableCell>
                    <Chip 
                      label={employee.status} 
                      size="small"
                      className={`status-chip ${employee.status === 'active' ? 'confirmed' : 'cancelled'}`}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      className="action-btn view-btn"
                      onClick={() => handleOpenEmployeeDialog(employee)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      className="action-btn delete-btn"
                      onClick={() => onDeleteEmployee(employee.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Employee Schedule */}
        <Box mt={4}>
          <Typography variant="h6" className="chart-title" mb={2}>
            Employee Schedule - Current Week
          </Typography>
          <Paper className="chart-paper" sx={{ p: 2 }}>
            <Box
              className="schedule-container"
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto repeat(7, 1fr)',
                gap: 1,
                overflowX: 'auto',
                '& > .schedule-header': {
                  backgroundColor: 'rgba(211, 130, 54, 0.2)',
                  p: 1,
                  borderRadius: 1,
                  textAlign: 'center',
                  fontWeight: 'bold',
                },
                '& > .schedule-employee': {
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
                '& > .schedule-shift': {
                  p: 1,
                  borderRadius: 1,
                  textAlign: 'center',
                  fontSize: '0.75rem',
                },
                '& .am-shift': {
                  backgroundColor: 'rgba(103, 58, 183, 0.3)',
                },
                '& .pm-shift': {
                  backgroundColor: 'rgba(211, 130, 54, 0.3)',
                },
                '& .day-off': {
                  backgroundColor: 'transparent',
                  color: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              <Box className="schedule-header"></Box>
              <Box className="schedule-header">Monday</Box>
              <Box className="schedule-header">Tuesday</Box>
              <Box className="schedule-header">Wednesday</Box>
              <Box className="schedule-header">Thursday</Box>
              <Box className="schedule-header">Friday</Box>
              <Box className="schedule-header">Saturday</Box>
              <Box className="schedule-header">Sunday</Box>

              {/* Alex */}
              <Box className="schedule-employee">Alex Johnson</Box>
              <Box className="schedule-shift am-shift">AM</Box>
              <Box className="schedule-shift am-shift">AM</Box>
              <Box className="schedule-shift day-off">OFF</Box>
              <Box className="schedule-shift pm-shift">PM</Box>
              <Box className="schedule-shift pm-shift">PM</Box>
              <Box className="schedule-shift pm-shift">PM</Box>
              <Box className="schedule-shift day-off">OFF</Box>

              {/* Maria */}
              <Box className="schedule-employee">Maria Garcia</Box>
              <Box className="schedule-shift am-shift">AM</Box>
              <Box className="schedule-shift am-shift">AM</Box>
              <Box className="schedule-shift am-shift">AM</Box>
              <Box className="schedule-shift am-shift">AM</Box>
              <Box className="schedule-shift day-off">OFF</Box>
              <Box className="schedule-shift day-off">OFF</Box>
              <Box className="schedule-shift pm-shift">PM</Box>

              {/* David */}
              <Box className="schedule-employee">David Wilson</Box>
              <Box className="schedule-shift day-off">OFF</Box>
              <Box className="schedule-shift pm-shift">PM</Box>
              <Box className="schedule-shift pm-shift">PM</Box>
              <Box className="schedule-shift pm-shift">PM</Box>
              <Box className="schedule-shift pm-shift">PM</Box>
              <Box className="schedule-shift am-shift">AM</Box>
              <Box className="schedule-shift day-off">OFF</Box>

              {/* Sarah */}
              <Box className="schedule-employee">Sarah Chen</Box>
              <Box className="schedule-shift pm-shift">PM</Box>
              <Box className="schedule-shift day-off">OFF</Box>
              <Box className="schedule-shift day-off">OFF</Box>
              <Box className="schedule-shift am-shift">AM</Box>
              <Box className="schedule-shift am-shift">AM</Box>
              <Box className="schedule-shift pm-shift">PM</Box>
              <Box className="schedule-shift pm-shift">PM</Box>
            </Box>
          </Paper>
        </Box>
      </Paper>

      <EmployeeDialog
        open={employeeDialog}
        employee={selectedEmployee}
        editMode={employeeEditMode}
        onClose={handleCloseEmployeeDialog}
        onUpdate={onUpdateEmployee}
        setEditMode={setEmployeeEditMode}
      />

      <AddEmployeeDialog
        open={addEmployeeDialog}
        onClose={() => setAddEmployeeDialog(false)}
        onAdd={onAddEmployee}
      />
    </motion.div>
  );
};

export default Employees;