// admin/components/sections/Feedback.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Rating,
  Avatar,
  Chip,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

import FeedbackResponseDialog from '../dialogs/FeedbackResponseDialog';
import { mockFeedbackData } from '../dashboard'; // Keep for type reference

interface FeedbackProps {
  feedback: typeof mockFeedbackData;
  onDeleteFeedback: (id: number) => void;
}

const Feedback: React.FC<FeedbackProps> = ({
  feedback: propsFeedback, // Renamed to avoid confusion with state variable
  onDeleteFeedback: propsDeleteFeedback
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackResponseDialog, setFeedbackResponseDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  
  // Add new state variables for API integration
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  // Fetch feedback data from the backend
  const fetchFeedback = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/feedback/', {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        }
      });
      
      const feedbackData = response.data;
      setFeedback(feedbackData);
      
      // Calculate statistics
      if (feedbackData.length > 0) {
        const totalRating = feedbackData.reduce((sum: number, item: any) => sum + item.experience_rating, 0);
        const avgRating = totalRating / feedbackData.length;
        
        // Count distribution
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        feedbackData.forEach((item: any) => {
          if (item.experience_rating >= 1 && item.experience_rating <= 5) {
            distribution[item.experience_rating as keyof typeof distribution]++;
          }
        });
        
        setStats({
          averageRating: parseFloat(avgRating.toFixed(1)),
          totalReviews: feedbackData.length,
          distribution
        });
      }
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('Failed to load feedback data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete feedback
  const handleDeleteFeedback = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        // The correct way to call the delete API with the ID in the URL
        await axios.delete(`http://127.0.0.1:8000/api/feedback/${id}/`, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('authToken')}`
          }
        });
        
        // Update local state
        setFeedback(feedback.filter((item) => item.feedback_id !== id));
        
        // Call the parent component's delete handler to maintain compatibility
        propsDeleteFeedback(id);
        
        // Show success message
        alert('Feedback deleted successfully');
      } catch (err: any) {
        console.error('Error deleting feedback:', err);
        
        // More detailed error message with status code
        const status = err.response?.status;
        const errorMsg = err.response?.data?.detail || 
                        err.response?.data?.message || 
                        `Failed to delete feedback (${status || 'unknown error'}). Please try again.`;
        
        alert(errorMsg);
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRespondToFeedback = (feedbackItem: any) => {
    setSelectedFeedback(feedbackItem);
    setFeedbackResponseDialog(true);
  };

  // Fetch feedback on component mount
  useEffect(() => {
    fetchFeedback();
  }, []);

  // Calculate percentages for distribution bars
  const getPercentage = (rating: number) => {
    if (stats.totalReviews === 0) return 0;
    return (stats.distribution[rating as keyof typeof stats.distribution] / stats.totalReviews) * 100;
  };

  // Filter feedback based on search query
  const filteredFeedback = feedback.filter((item: any) => {
    const userName = `${item.user?.first_name || ''} ${item.user?.last_name || ''}`.trim();
    return (
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.feedback_text || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Helper function to get user's name
  const getUserName = (item: any) => {
    if (item.user) {
      return `${item.user.first_name || ''} ${item.user.last_name || ''}`.trim() || item.user.email;
    }
    return 'Anonymous';
  };

  // Helper function to get first letter of name for avatar
  const getNameInitial = (item: any) => {
    if (item.user && item.user.first_name) {
      return item.user.first_name.charAt(0);
    }
    if (item.user && item.user.email) {
      return item.user.email.charAt(0);
    }
    return 'A';
  };

  return (
    <motion.div
      key="feedback"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Paper className="content-paper">
        <Box className="content-header">
          <Typography variant="h5" className="content-title">Customer Feedback</Typography>
          <Box className="content-actions">
            <TextField
              size="small"
              placeholder="Search feedback"
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        ) : (
          <>
            <Box className="feedback-summary">
              <Paper className="summary-card">
                <Box className="summary-content">
                  <Typography className="summary-title">Average Rating</Typography>
                  <Typography variant="h4" className="summary-value">{stats.averageRating}</Typography>
                </Box>
                <Rating value={stats.averageRating} precision={0.1} readOnly />
              </Paper>
              
              <Paper className="summary-card">
                <Box className="summary-content">
                  <Typography className="summary-title">Total Reviews</Typography>
                  <Typography variant="h4" className="summary-value">{stats.totalReviews}</Typography>
                </Box>
                <Box className="rating-breakdown">
                  <Box className="rating-bar">
                    <Typography variant="caption">5★</Typography>
                    <Box className="bar-container">
                      <Box className="bar-fill" sx={{ width: `${getPercentage(5)}%` }}></Box>
                    </Box>
                    <Typography variant="caption">{Math.round(getPercentage(5))}%</Typography>
                  </Box>
                  <Box className="rating-bar">
                    <Typography variant="caption">4★</Typography>
                    <Box className="bar-container">
                      <Box className="bar-fill" sx={{ width: `${getPercentage(4)}%` }}></Box>
                    </Box>
                    <Typography variant="caption">{Math.round(getPercentage(4))}%</Typography>
                  </Box>
                  <Box className="rating-bar">
                    <Typography variant="caption">3★</Typography>
                    <Box className="bar-container">
                      <Box className="bar-fill" sx={{ width: `${getPercentage(3)}%` }}></Box>
                    </Box>
                    <Typography variant="caption">{Math.round(getPercentage(3))}%</Typography>
                  </Box>
                  <Box className="rating-bar">
                    <Typography variant="caption">2★</Typography>
                    <Box className="bar-container">
                      <Box className="bar-fill" sx={{ width: `${getPercentage(2)}%` }}></Box>
                    </Box>
                    <Typography variant="caption">{Math.round(getPercentage(2))}%</Typography>
                  </Box>
                  <Box className="rating-bar">
                    <Typography variant="caption">1★</Typography>
                    <Box className="bar-container">
                      <Box className="bar-fill" sx={{ width: `${getPercentage(1)}%` }}></Box>
                    </Box>
                    <Typography variant="caption">{Math.round(getPercentage(1))}%</Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
            
            {filteredFeedback.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="body1">No feedback found</Typography>
              </Box>
            ) : (
              <Box className="feedback-grid">
                {filteredFeedback.map((item: any) => (
                  <Paper key={item.feedback_id} className="feedback-card">
                    <Box className="feedback-card-header">
                      <Box className="feedback-user">
                        <Avatar className="feedback-avatar">{getNameInitial(item)}</Avatar>
                        <Box>
                          <Typography variant="subtitle2">{getUserName(item)}</Typography>
                          <Typography variant="caption" className="feedback-date">
                            {formatDate(item.created_at)}
                          </Typography>
                        </Box>
                      </Box>
                      <Rating value={item.experience_rating} readOnly size="small" />
                    </Box>
                    
                    <Typography variant="body2" className="feedback-message">
                      <FormatQuoteIcon className="quote-icon" />
                      {item.feedback_text}
                    </Typography>

                    {item.response_text && (
                      <Box sx={{ 
                        backgroundColor: 'rgba(211, 130, 54, 0.05)', 
                        p: 1, 
                        borderRadius: 1, 
                        mb: 2,
                        borderLeft: '3px solid var(--accent-color)'
                      }}>
                        <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                          Our Response:
                        </Typography>
                        <Typography variant="body2">
                          {item.response_text}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box className="feedback-actions">
                      {!item.response_text && (
                        <Button 
                          size="small" 
                          startIcon={<CheckCircleIcon />}
                          className="btn-respond"
                          onClick={() => handleRespondToFeedback(item)}
                        >
                          Respond
                        </Button>
                      )}
                      <IconButton 
                        size="small" 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteFeedback(item.feedback_id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </>
        )}
      </Paper>

      <FeedbackResponseDialog
        open={feedbackResponseDialog}
        feedbackItem={selectedFeedback}
        onClose={() => setFeedbackResponseDialog(false)}
        onResponseSent={fetchFeedback} // Refresh data after responding
      />
    </motion.div>
  );
};

export default Feedback;