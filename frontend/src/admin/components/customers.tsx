import React, { useState } from 'react';
import { Paper, Box, Typography, TextField, InputAdornment, IconButton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import { motion, AnimatePresence } from 'framer-motion';

// Mock customer data
const mockCustomers = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', visits: 12, lastVisit: '2025-04-15', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', visits: 8, lastVisit: '2025-04-10', status: 'active' },
  { id: 3, name: 'Robert Johnson', email: 'robert.j@example.com', visits: 5, lastVisit: '2025-04-05', status: 'active' },
  { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', visits: 15, lastVisit: '2025-04-18', status: 'active' },
  { id: 5, name: 'Michael Brown', email: 'michael.b@example.com', visits: 3, lastVisit: '2025-03-20', status: 'inactive' },
];

const CustomersSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredCustomers = mockCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="customers"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Paper className="content-paper">
          <Box className="content-header">
            <Typography variant="h5" className="content-title">Customers</Typography>
            <Box className="content-actions">
              <TextField
                size="small"
                placeholder="Search customers"
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
            </Box>
          </Box>

          <TableContainer className="table-container">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Total Visits</TableCell>
                  <TableCell>Last Visit</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="table-row">
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: '#d38236' }}>
                          {customer.name.charAt(0)}
                        </Avatar>
                        {customer.name}
                      </Box>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.visits}</TableCell>
                    <TableCell>{customer.lastVisit}</TableCell>
                    <TableCell>
                      <Chip 
                        label={customer.status} 
                        size="small"
                        className={`status-chip ${customer.status}`}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </motion.div>
    </AnimatePresence>
  );
};

export default CustomersSection;