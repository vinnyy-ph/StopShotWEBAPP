// admin/components/sections/Reservations.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { Reservation, getStatusDisplay } from '../dashboard';
import ReservationDialog from '../dialogs/ReservationDialog';
import ReservationFormDialog from '../dialogs/ReservationFormDialog';
import AddReservationDialog from '../dialogs/AddReservationDialog';

// Define the Room interface based on the backend model
interface Room {
  id: number;
  room_name: string;
  room_description?: string;
  room_can_be_booked: boolean;
  max_number_of_people: number;
  room_type: string;
}

// Create axios instance with authorization header
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add auth token to requests if available
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

interface ReservationsProps {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  onAddReservation: (newReservation: any) => Promise<boolean>;
  onUpdateReservation: (reservation: any) => Promise<boolean>;
  onDeleteReservation: (id: number) => Promise<boolean>;
  onStatusChange: (id: number, status: string) => Promise<void>;
}

const Reservations: React.FC<ReservationsProps> = ({
  reservations,
  loading,
  error,
  onAddReservation,
  onUpdateReservation,
  onDeleteReservation,
  onStatusChange
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [reservationDialog, setReservationDialog] = useState(false);
  const [addReservationDialog, setAddReservationDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axiosInstance.get('/rooms/');
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    
    fetchRooms();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenReservationDialog = (reservation: any) => {
    setSelectedReservation(reservation);
    setReservationDialog(true);
    setEditMode(false);
  };

  const handleCloseReservationDialog = () => {
    setReservationDialog(false);
  };

  const handleViewReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
  };

  const handleOpenAddDialog = () => {
    setSelectedReservation(null);
    setDialogMode('add');
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = () => {
    setDialogMode('edit');
    setViewDialogOpen(false);
    setFormDialogOpen(true);
  };

  const handleCloseFormDialog = () => {
    setFormDialogOpen(false);
  };

  const handleSaveReservation = async (reservationData: any) => {
    setIsSubmitting(true);
    try {
      console.log(`Attempting to ${dialogMode === 'add' ? 'create' : 'update'} reservation:`, reservationData);
      
      let success = false;
      if (dialogMode === 'add') {
        success = await handleAddReservation(reservationData);
      } else {
        success = await handleUpdateReservation(reservationData);
      }
      
      console.log(`Reservation ${dialogMode} ${success ? 'successful' : 'failed'}`);
      setIsSubmitting(false);
      return success;
    } catch (error) {
      console.error(`Error ${dialogMode === 'add' ? 'creating' : 'updating'} reservation:`, error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response data:', error.response.data);
      }
      setIsSubmitting(false);
      return false;
    }
  };

  const handleAddReservation = async (reservationData: any) => {
    try {
      // Remove id field for new reservations
      const { id, ...dataToSubmit } = reservationData;
      
      // Process room_id into proper format for API
      if (dataToSubmit.room_id) {
        dataToSubmit.room = dataToSubmit.room_id;
        delete dataToSubmit.room_id;
      }
      
      // Call the parent's onAddReservation and get the response
      const response = await onAddReservation(dataToSubmit);
      
      // The response could be the formatted data or just a boolean
      return response;
    } catch (error) {
      console.error('Error in handleAddReservation:', error);
      return false;
    }
  };

  const handleUpdateReservation = async (reservationData: any) => {
    try {
      // Process room_id into proper format for API
      const dataToSubmit = { ...reservationData };
      
      if (dataToSubmit.room_id) {
        dataToSubmit.room = dataToSubmit.room_id;
        delete dataToSubmit.room_id;
      }
      
      const response = await onUpdateReservation(dataToSubmit);
      return response;
    } catch (error) {
      console.error('Error in handleUpdateReservation:', error);
      return false;
    }
  };

  // Filter reservations based on search query
  const filteredReservations = reservations.filter(res => 
    (res.guest_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (res.guest_email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (res.reservation_date || '').includes(searchQuery) ||
    (res.room_type?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (res.room?.room_name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      key="reservations"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Paper className="content-paper">
        <Box className="content-header">
          <Typography variant="h5" className="content-title">
            Manage Reservations
          </Typography>
          
          <Box className="content-actions">
            <TextField
              placeholder="Search reservations..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearch}
              className="search-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              className="add-button"
              onClick={() => setAddReservationDialog(true)}
            >
              Add New
            </Button>
          </Box>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          className="content-tabs"
        >
          <Tab label="All Reservations" />
          <Tab label="Confirmed" />
          <Tab label="Pending" />
          <Tab label="Cancelled" />
        </Tabs>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        ) : (
          <TableContainer className="table-container">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Guests</TableCell>
                  <TableCell>Table Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReservations.map((row, index) => (
                  <TableRow key={row.id || `temp-${index}`} className="table-row">
                    <TableCell>{row.guest_name}</TableCell>
                    <TableCell>{row.guest_email}</TableCell>
                    <TableCell>{row.reservation_date}</TableCell>
                    <TableCell>{row.reservation_time}</TableCell>
                    <TableCell>{row.number_of_guests}</TableCell>
                    <TableCell>{row.room?.room_name || row.room_type || 'Unassigned'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status_display || row.status || 'PENDING'} 
                        className={`status-chip ${((row.status || 'PENDING')?.toLowerCase() || '')}`}
                      />
                    </TableCell>
                    <TableCell align="right" className="action-cell">
                      <IconButton size="small" onClick={() => handleViewReservation(row)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => onStatusChange(row.id, 'CONFIRMED')}
                        disabled={row.status === 'CONFIRMED'}
                        className="confirm-button"
                      >
                        <CheckCircleIcon fontSize="small" style={{ color: row.status === 'CONFIRMED' ? '#4caf50' : '#aaa' }} />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => onStatusChange(row.id, 'CANCELLED')}
                        disabled={row.status === 'CANCELLED'}
                        className="cancel-button"
                      >
                        <CancelIcon fontSize="small" style={{ color: row.status === 'CANCELLED' ? '#f44336' : '#aaa' }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => onDeleteReservation(row.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      
      {/* Reservation Dialog */}
      <ReservationDialog
        open={reservationDialog}
        reservation={selectedReservation}
        onClose={handleCloseReservationDialog}
        onEdit={() => setEditMode(true)}
      />

      {/* Add Reservation Dialog */}
      <AddReservationDialog
        open={addReservationDialog}
        onClose={() => setAddReservationDialog(false)}
        onAdd={onAddReservation}
      />

      {/* View reservation dialog */}
      <ReservationDialog
        open={viewDialogOpen}
        reservation={selectedReservation}
        onClose={handleCloseViewDialog}
        onEdit={() => {
          console.log("Edit button clicked for reservation:", selectedReservation?.id);
          handleOpenEditDialog();
        }}
      />
      
      {/* Add/Edit reservation dialog */}
      <ReservationFormDialog
        open={formDialogOpen}
        reservation={selectedReservation}
        onClose={handleCloseFormDialog}
        onSave={handleSaveReservation}
        rooms={rooms}
        isLoading={isSubmitting}
        mode={dialogMode}
      />
    </motion.div>
  );
};

export default Reservations;