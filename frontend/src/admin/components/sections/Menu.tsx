import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  CircularProgress,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
  useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import MenuItemDialog from '../dialogs/MenuItemDialog';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

// MenuItem interface
export interface MenuItem {
  menu_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
}

// Initial categories, will be updated from API
const initialCategories = ['All Categories'];

interface MenuProps {
  onAddMenuItem: (menuItem: MenuItem) => Promise<boolean>;
  onUpdateMenuItem: (menuItem: MenuItem) => Promise<boolean>;
  onDeleteMenuItem: (id: number) => Promise<boolean>;
}

const Menu: React.FC<MenuProps> = ({ onAddMenuItem, onUpdateMenuItem, onDeleteMenuItem }) => {
  const { authToken } = useAuth();
  const API_BASE_URL = 'http://127.0.0.1:8000/api';
  const theme = useTheme();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [categories, setCategories] = useState<string[]>(initialCategories);

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Token ${authToken}`,
      'Content-Type': 'application/json'
    }
  });

  // Fetch menu items
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Extract unique categories from menu items
  useEffect(() => {
    if (menuItems.length > 0) {
      const uniqueCategories = [...new Set(menuItems.map(item => item.category))];
      setCategories(['All Categories', ...uniqueCategories]);
    }
  }, [menuItems]);

  // Filter menu items when search term changes
  useEffect(() => {
    filterMenuItems();
  }, [searchTerm, categoryFilter, availabilityFilter, menuItems]);

  const fetchMenuItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/menus/list');
      setMenuItems(response.data);
      setFilteredItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError('Failed to load menu items. Please try again.');
      setLoading(false);
    }
  };

  const filterMenuItems = () => {
    let filtered = [...menuItems];
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category - use exact case-insensitive matching
    if (categoryFilter !== 'All Categories') {
      filtered = filtered.filter(item => 
        item.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    
    // Filter by availability
    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(item => 
        availabilityFilter === 'available' ? item.is_available : !item.is_available
      );
    }
    
    setFilteredItems(filtered);
    setPage(0); // Reset to first page when filters change
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAddDialog = () => {
    setSelectedMenuItem(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMenuItem(null);
  };

  const handleDeleteMenuItem = async (id: number) => {
    const success = await onDeleteMenuItem(id);
    if (success) {
      setMenuItems(menuItems.filter(item => item.menu_id !== id));
    }
  };

  const handleSaveMenuItem = async (menuItem: MenuItem) => {
    let success = false;
    
    if (selectedMenuItem) {
      // Update
      success = await onUpdateMenuItem(menuItem);
      if (success) {
        setMenuItems(menuItems.map(item => 
          item.menu_id === menuItem.menu_id ? menuItem : item
        ));
      }
    } else {
      // Add
      success = await onAddMenuItem(menuItem);
      if (success) {
        fetchMenuItems(); // Refresh to get the server-generated ID
      }
    }
    
    if (success) {
      handleCloseDialog();
    }
    
    return success;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh" sx={{ color: 'white' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh" sx={{ color: 'white' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Dark mode styling with stronger values to ensure proper application
  const darkModeStyles = {
    paper: {
      backgroundColor: '#1e1e1e',
      color: '#ffffff',
    },
    tableRow: {
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
      }
    },
    tableCell: {
      color: '#ffffff',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    tableHead: {
      backgroundColor: '#2d2d2d',
    },
    input: {
      color: '#ffffff',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255, 255, 255, 0.23)',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255, 255, 255, 0.5)',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#90caf9',
      },
      '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)',
      },
      '& .MuiSelect-icon': {
        color: 'rgba(255, 255, 255, 0.7)',
      },
      '& .MuiInputBase-input': {
        color: '#ffffff',
      }
    }
  };

  return (
    <Box sx={{ p: 2, bgcolor: '#121212', color: '#ffffff', minHeight: '100vh' }} className="menu-management">
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 3,
          gap: 2
        }}
      >
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
          Menu Management
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add Item
        </Button>
      </Box>

      <Paper 
        sx={{ 
          width: '100%', 
          mb: 3, 
          p: 2, 
          borderRadius: 2,
          ...darkModeStyles.paper
        }} 
        elevation={3}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 2, 
            mb: 2 
          }}
        >
          <TextField 
            placeholder="Search menu items..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              flexGrow: 1,
              '& .MuiOutlinedInput-root': darkModeStyles.input,
              '& .MuiInputLabel-root': { color: '#ffffff' },
              '& .MuiInputAdornment-root': { color: '#ffffff' }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#ffffff' }} />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: '#ffffff' }}>Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as string)}
              label="Category"
              sx={{ 
                color: '#ffffff',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#90caf9' },
                '.MuiSvgIcon-root': { color: '#ffffff' }
              }}
              MenuProps={{
                PaperProps: {
                  sx: { bgcolor: '#1e1e1e' }
                }
              }}
            >
              {categories.map(cat => (
                <MuiMenuItem key={cat} value={cat} sx={{ color: '#ffffff' }}>{cat}</MuiMenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: '#ffffff' }}>Availability</InputLabel>
            <Select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as string)}
              label="Availability"
              sx={{ 
                color: '#ffffff',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#90caf9' },
                '.MuiSvgIcon-root': { color: '#ffffff' }
              }}
              MenuProps={{
                PaperProps: {
                  sx: { bgcolor: '#1e1e1e' }
                }
              }}
            >
              <MuiMenuItem value="all" sx={{ color: '#ffffff' }}>All Items</MuiMenuItem>
              <MuiMenuItem value="available" sx={{ color: '#ffffff' }}>Available Only</MuiMenuItem>
              <MuiMenuItem value="unavailable" sx={{ color: '#ffffff' }}>Unavailable Only</MuiMenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Paper 
        sx={{ 
          width: '100%', 
          mb: 2, 
          overflow: 'hidden', 
          borderRadius: 2,
          ...darkModeStyles.paper
        }} 
        elevation={3}
      >
        <TableContainer sx={{ maxHeight: '60vh', bgcolor: '#1e1e1e' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', ...darkModeStyles.tableHead, ...darkModeStyles.tableCell }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', ...darkModeStyles.tableHead, ...darkModeStyles.tableCell }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold', ...darkModeStyles.tableHead, ...darkModeStyles.tableCell }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 'bold', ...darkModeStyles.tableHead, ...darkModeStyles.tableCell }}>Category</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', ...darkModeStyles.tableHead, ...darkModeStyles.tableCell }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', ...darkModeStyles.tableHead, ...darkModeStyles.tableCell }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                  <TableRow 
                    key={item.menu_id}
                    hover
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      bgcolor: '#1e1e1e',
                      ...darkModeStyles.tableRow
                    }}
                  >
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'medium', ...darkModeStyles.tableCell }}>
                      {item.name}
                    </TableCell>
                    <TableCell sx={darkModeStyles.tableCell}>
                      {item.description.length > 50
                        ? `${item.description.substring(0, 50)}...`
                        : item.description}
                    </TableCell>
                    <TableCell sx={darkModeStyles.tableCell}>
                      ${typeof item.price === 'number' ? item.price.toFixed(2) : Number(item.price).toFixed(2)}
                    </TableCell>
                    <TableCell sx={darkModeStyles.tableCell}>
                      <Chip 
                        label={item.category} 
                        color="primary" 
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center" sx={darkModeStyles.tableCell}>
                      <Chip 
                        label={item.is_available ? "Available" : "Unavailable"} 
                        color={item.is_available ? "success" : "error"}
                        size="small"
                        sx={{ minWidth: 100 }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={darkModeStyles.tableCell}>
                      <IconButton 
                        color="primary" 
                        size="small"
                        onClick={() => handleOpenEditDialog(item)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => handleDeleteMenuItem(item.menu_id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3, ...darkModeStyles.tableCell }}>
                    <Typography sx={{ color: '#9e9e9e' }}>
                      No menu items found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            color: '#ffffff',
            '.MuiTablePagination-selectIcon, .MuiTablePagination-actions': {
              color: '#ffffff',
            }
          }}
        />
      </Paper>

      <MenuItemDialog 
        open={openDialog}
        menuItem={selectedMenuItem}
        onClose={handleCloseDialog}
        onSave={handleSaveMenuItem}
        availableCategories={menuItems.map(item => item.category)}
      />
    </Box>
  );
};

export default Menu; 