import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  InputAdornment,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Box,
  Typography,
  useTheme
} from '@mui/material';
import { MenuItem as MenuItemType } from '../sections/Menu';

interface MenuItemDialogProps {
  open: boolean;
  menuItem: MenuItemType | null;
  onClose: () => void;
  onSave: (menuItem: MenuItemType) => Promise<boolean>;
  availableCategories?: string[];
}

const DEFAULT_CATEGORIES = [
  'APPETIZERS',
  'MAIN COURSE',
  'DESSERTS',
  'BEVERAGES',
  'ALCOHOL',
  'SIDES',
  'SPECIALS'
];

const MenuItemDialog: React.FC<MenuItemDialogProps> = ({ 
  open, 
  menuItem, 
  onClose, 
  onSave,
  availableCategories = [] 
}) => {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Combine default categories with any unique ones from the backend
  const categories = [...new Set([
    ...DEFAULT_CATEGORIES,
    ...availableCategories
  ])].sort();

  useEffect(() => {
    if (menuItem) {
      setName(menuItem.name || '');
      setDescription(menuItem.description || '');
      setPrice(menuItem.price.toString() || '');
      setCategory(menuItem.category || '');
      setIsAvailable(menuItem.is_available);
      setImageUrl(menuItem.image_url || '');
    } else {
      // Reset form for new item
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setIsAvailable(true);
      setImageUrl('');
    }
    setErrors({});
  }, [menuItem, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    
    if (!price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      newErrors.price = 'Price must be a valid positive number';
    }
    
    if (!category) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    
    const menuItemData: MenuItemType = {
      menu_id: menuItem?.menu_id || 0, // 0 for new items, will be ignored by backend
      name,
      description,
      price: parseFloat(price),
      category,
      is_available: isAvailable,
      image_url: imageUrl
    };
    
    try {
      const success = await onSave(menuItemData);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
    } finally {
      setSaving(false);
    }
  };

  // Dark mode styling with stronger values
  const darkModeStyles = {
    paper: {
      backgroundColor: '#1e1e1e',
      color: '#ffffff',
    },
    input: {
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.23)',
        },
        '&:hover fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#90caf9',
        },
      },
      '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)',
      },
      '& .MuiInputBase-input': {
        color: '#ffffff',
      }
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={!saving ? onClose : undefined}
      fullWidth
      maxWidth="md"
      PaperProps={{
        elevation: 5,
        sx: { 
          borderRadius: 2,
          backgroundColor: '#1e1e1e',
          color: '#ffffff'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1, color: '#ffffff' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {menuItem ? 'Edit Menu Item' : 'Add New Menu Item'}
        </Typography>
      </DialogTitle>
      
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      
      <DialogContent sx={{ pt: 3, bgcolor: '#1e1e1e' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              disabled={saving}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#90caf9' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiInputBase-input': { color: '#ffffff' },
                '& .MuiFormHelperText-root': { color: theme.palette.error.main }
              }}
              InputLabelProps={{
                style: { color: 'rgba(255, 255, 255, 0.7)' }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl 
              fullWidth 
              error={!!errors.category} 
              disabled={saving}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#90caf9' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiInputBase-input': { color: '#ffffff' },
                '& .MuiSvgIcon-root': { color: '#ffffff' }
              }}
            >
              <InputLabel style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
                MenuProps={{
                  PaperProps: {
                    sx: { bgcolor: '#1e1e1e' }
                  }
                }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat} sx={{ color: '#ffffff' }}>{cat}</MenuItem>
                ))}
                <MenuItem value="OTHER" sx={{ color: '#ffffff' }}>OTHER</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Price"
              fullWidth
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start" sx={{ color: '#ffffff' }}>$</InputAdornment>,
              }}
              error={!!errors.price}
              helperText={errors.price}
              disabled={saving}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#90caf9' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiInputBase-input': { color: '#ffffff' },
                '& .MuiFormHelperText-root': { color: theme.palette.error.main }
              }}
              InputLabelProps={{
                style: { color: 'rgba(255, 255, 255, 0.7)' }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Image URL (optional)"
              fullWidth
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={saving}
              variant="outlined"
              placeholder="https://example.com/image.jpg"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#90caf9' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiInputBase-input': { color: '#ffffff' }
              }}
              InputLabelProps={{
                style: { color: 'rgba(255, 255, 255, 0.7)' }
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              disabled={saving}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#90caf9' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiInputBase-input': { color: '#ffffff' },
                '& .MuiFormHelperText-root': { color: theme.palette.error.main }
              }}
              InputLabelProps={{
                style: { color: 'rgba(255, 255, 255, 0.7)' }
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  disabled={saving}
                  color="success"
                />
              }
              label={
                <Typography sx={{ fontWeight: isAvailable ? 'medium' : 'normal', color: '#ffffff' }}>
                  {isAvailable ? "Available on menu" : "Not available on menu"}
                </Typography>
              }
            />
          </Grid>
          
          {imageUrl && (
            <Grid item xs={12}>
              <Box sx={{ mt: 1, textAlign: 'center' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#ffffff' }}>Image Preview:</Typography>
                <Box 
                  component="img"
                  src={imageUrl}
                  alt={name}
                  sx={{ 
                    maxHeight: 200, 
                    maxWidth: '100%', 
                    borderRadius: 1,
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = 'https://via.placeholder.com/200x150?text=Invalid+Image+URL';
                  }}
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      
      <DialogActions sx={{ px: 3, py: 2, bgcolor: '#1e1e1e' }}>
        <Button 
          onClick={onClose} 
          disabled={saving}
          color="inherit"
          variant="outlined"
          sx={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.5)' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MenuItemDialog; 