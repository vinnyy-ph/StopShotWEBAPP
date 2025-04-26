import React, { useState } from 'react';
import { Paper, Box, Typography, TextField, InputAdornment, IconButton, Button, Tabs, Tab, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';
import { mockReservations } from '../data/mockData';

const ReservationsSection: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [reservationDialog, setReservationDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenReservationDialog = (reservation: any) => {
    setSelectedReservation(reservation);
    setReservationDialog(true);
  };

  const handleCloseReservationDialog = () => {
    setReservationDialog(false);
  };

  const filteredReservations = mockReservations.filter(res => 
    res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.date.includes(searchQuery) ||
    res.tableType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="reservations"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Paper className="content-paper">
          <Box className="content-header">
            <Typography variant="h5" className="content-title">Reservations</Typography>
            <Box className="content-actions">
              <TextField
                size="small"
                placeholder="Search reservations"
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

          <TableContainer className="table-container">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Guests</TableCell>
                  <TableCell>Table Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReservations.map((row) => (
                  <TableRow key={row.id} className="table-row">
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>{row.guests}</TableCell>
                    <TableCell>{row.tableType}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status} 
                        size="small"
                        className={`status-chip ${row.status}`}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        className="action-btn view-btn"
                        onClick={() => handleOpenReservationDialog(row)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog
          open={reservationDialog}
          onClose={handleCloseReservationDialog}
          className="reservation-dialog"
        >
          {selectedReservation && (
            <>
              <DialogTitle className="dialog-title">
                Reservation Details
                <IconButton
                  onClick={handleCloseReservationDialog}
                  size="small"
                  className="dialog-close"
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent className="dialog-content">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Customer</Typography>
                    <Typography variant="body1" className="detail-value">
                      {selectedReservation.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Reservation Date</Typography>
                    <Typography variant="body1" className="detail-value">
                      {selectedReservation.date} at {selectedReservation.time}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Guests</Typography>
                    <Typography variant="body1" className="detail-value">
                      {selectedReservation.guests} people
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Table Type</Typography>
                    <Typography variant="body1" className="detail-value">
                      {selectedReservation.tableType}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Status</Typography>
                    <Chip 
                      label={selectedReservation.status} 
                      size="small"
                      className={`status-chip ${selectedReservation.status}`}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions className="dialog-actions">
                <Button 
                  onClick={handleCloseReservationDialog} 
                  className="dialog-btn cancel-btn"
                >
                  Close
                </Button>
                <Button 
                  variant="contained"
                  className="dialog-btn confirm-btn"
                >
                  Update Status
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReservationsSection;