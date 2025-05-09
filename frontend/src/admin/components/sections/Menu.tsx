import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
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
  styled,
  Tabs,
  Tab
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

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: '#121212',
  '& .MuiTable-root': {
    borderCollapse: 'separate',
    borderSpacing: '0 0',
  },
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: '#121212',
  color: '#a0a0a0',
  borderBottom: '1px solid #333',
  fontSize: '0.75rem',
  fontWeight: 500,
  textTransform: 'uppercase',
  padding: '10px 16px',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: '1px solid #1a1a1a',
  color: 'white',
  padding: '16px',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: '#121212',
  '&:hover': {
    backgroundColor: '#1a1a1a',
  },
}));

const StyledCategoryChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#1e3a8a',
  color: '#4299e1',
  borderRadius: '16px',
  fontWeight: 500,
  fontSize: '0.75rem',
  height: '24px',
}));

const StyledStatusChip = styled(Chip)(({ theme }) => ({
  borderRadius: '16px',
  fontWeight: 500,
  fontSize: '0.75rem',
  height: '24px',
  '&.available': {
    backgroundColor: '#1e462a',
    color: '#48bb78',
  },
  '&.unavailable': {
    backgroundColor: '#461e1e',
    color: '#f56565',
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: '#a0a0a0',
  textTransform: 'none',
  fontSize: '0.875rem',
  minWidth: 80,
  '&.Mui-selected': {
    color: 'white',
  },
  '&:hover': {
    color: 'white',
    opacity: 1,
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: 16,
  '& .MuiTabs-indicator': {
    backgroundColor: '#3182ce',
  },
}));

const StyledSearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    height: 38,
    color: 'white',
    '& fieldset': {
      border: 'none'
    },
    '&:hover fieldset': {
      border: 'none'
    },
    '&.Mui-focused fieldset': {
      border: 'none'
    }
  },
  '& .MuiInputBase-input': {
    padding: '8px 14px'
  }
}));

const StyledAddButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#1976d2',
  color: 'white',
  textTransform: 'none',
  borderRadius: 4,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#1565c0',
    boxShadow: 'none',
  }
}));

const Menu: React.FC<MenuProps> = ({ onAddMenuItem, onUpdateMenuItem, onDeleteMenuItem }) => {
  const { authToken } = useAuth();
  const API_BASE_URL = 'http://127.0.0.1:8000/api';
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

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

  // Filter menu items when search term or tab changes
  useEffect(() => {
    filterMenuItems();
  }, [searchTerm, tabValue, menuItems]);

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
    
    // Filter by tab selection
    if (tabValue > 0) {
      // Tab 1: All Categories (no filter)
      // Tab 2: Available Items
      if (tabValue === 1) {
        filtered = filtered.filter(item => item.is_available);
      }
      // Tab 3: Unavailable Items
      else if (tabValue === 2) {
        filtered = filtered.filter(item => !item.is_available);
      }
      // Tab 4+: Filter by category (if available)
      else if (categories.length > 0 && tabValue < categories.length + 2) {
        const categoryFilter = categories[tabValue - 2];
        filtered = filtered.filter(item => item.category === categoryFilter);
      }
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

  return (
    <Box sx={{ p: 2, bgcolor: '#121212', color: 'white', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Menu Management
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <StyledSearchField
            placeholder="Search menu items..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#a0a0a0' }} />
                </InputAdornment>
              ),
            }}
          />
          <StyledAddButton
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleOpenAddDialog}
          >
            ADD ITEM
          </StyledAddButton>
        </Box>
      </Box>

      {/* Tabs */}
      <StyledTabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <StyledTab label="All Items" />
        <StyledTab label="Available" />
        <StyledTab label="Unavailable" />
        {categories.slice(1).map((category, index) => (
          <StyledTab key={index} label={category} />
        ))}
      </StyledTabs>

      {/* Table */}
      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>Name</StyledTableHeadCell>
              <StyledTableHeadCell>Description</StyledTableHeadCell>
              <StyledTableHeadCell>Price</StyledTableHeadCell>
              <StyledTableHeadCell>Category</StyledTableHeadCell>
              <StyledTableHeadCell>Status</StyledTableHeadCell>
              <StyledTableHeadCell align="right">Actions</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <StyledTableRow key={item.menu_id}>
                  <StyledTableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {item.name}
                  </StyledTableCell>
                  <StyledTableCell>
                    {item.description.length > 50
                      ? `${item.description.substring(0, 50)}...`
                      : item.description}
                  </StyledTableCell>
                  <StyledTableCell>
                    ${typeof item.price === 'number' ? item.price.toFixed(2) : Number(item.price).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell>
                    <StyledCategoryChip 
                      label={item.category.toUpperCase()} 
                      size="small"
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <StyledStatusChip 
                      label={item.is_available ? "Available" : "Unavailable"} 
                      className={item.is_available ? 'available' : 'unavailable'}
                      size="small"
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <IconButton 
                      size="small"
                      onClick={() => handleOpenEditDialog(item)}
                      sx={{ color: '#3182ce' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={() => handleDeleteMenuItem(item.menu_id)}
                      sx={{ color: '#e53e3e' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            {filteredItems.length === 0 && (
              <StyledTableRow>
                <StyledTableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography sx={{ color: '#9e9e9e' }}>
                    No menu items found.
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          color: '#a0a0a0',
          '.MuiTablePagination-selectIcon, .MuiTablePagination-actions': {
            color: '#a0a0a0',
          }
        }}
        labelRowsPerPage="Rows per page:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
      />

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