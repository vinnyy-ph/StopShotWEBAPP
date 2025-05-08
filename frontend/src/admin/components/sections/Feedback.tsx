// admin/components/sections/Feedback.tsx
import React, { useState } from 'react';
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
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';

import FeedbackResponseDialog from '../dialogs/FeedbackResponseDialog';
import { mockFeedbackData } from '../dashboard';

interface FeedbackProps {
  feedback: typeof mockFeedbackData;
  onDeleteFeedback: (id: number) => void;
}

const Feedback: React.FC<FeedbackProps> = ({
  feedback,
  onDeleteFeedback
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackResponseDialog, setFeedbackResponseDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRespondToFeedback = (feedbackItem: any) => {
    setSelectedFeedback(feedbackItem);
    setFeedbackResponseDialog(true);
  };

  // Filter feedback based on search query
  const filteredFeedback = feedback.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        <Box className="feedback-summary">
          <Paper className="summary-card">
            <Box className="summary-content">
              <Typography className="summary-title">Average Rating</Typography>
              <Typography variant="h4" className="summary-value">4.6</Typography>
            </Box>
            <Rating value={4.6} precision={0.1} readOnly />
          </Paper>
          
          <Paper className="summary-card">
            <Box className="summary-content">
              <Typography className="summary-title">Total Reviews</Typography>
              <Typography variant="h4" className="summary-value">87</Typography>
            </Box>
            <Box className="rating-breakdown">
              <Box className="rating-bar">
                <Typography variant="caption">5★</Typography>
                <Box className="bar-container">
                  <Box className="bar-fill" sx={{ width: '65%' }}></Box>
                </Box>
                <Typography variant="caption">65%</Typography>
              </Box>
              <Box className="rating-bar">
                <Typography variant="caption">4★</Typography>
                <Box className="bar-container">
                  <Box className="bar-fill" sx={{ width: '20%' }}></Box>
                </Box>
                <Typography variant="caption">20%</Typography>
              </Box>
              <Box className="rating-bar">
                <Typography variant="caption">3★</Typography>
                <Box className="bar-container">
                  <Box className="bar-fill" sx={{ width: '10%' }}></Box>
                </Box>
                <Typography variant="caption">10%</Typography>
              </Box>
              <Box className="rating-bar">
                <Typography variant="caption">2★</Typography>
                <Box className="bar-container">
                  <Box className="bar-fill" sx={{ width: '3%' }}></Box>
                </Box>
                <Typography variant="caption">3%</Typography>
              </Box>
              <Box className="rating-bar">
                <Typography variant="caption">1★</Typography>
                <Box className="bar-container">
                  <Box className="bar-fill" sx={{ width: '2%' }}></Box>
                </Box>
                <Typography variant="caption">2%</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
        
        <Box className="feedback-grid">
          {filteredFeedback.map((item) => (
            <Paper key={item.id} className="feedback-card">
              <Box className="feedback-card-header">
                <Box className="feedback-user">
                  <Avatar className="feedback-avatar">{item.name.charAt(0)}</Avatar>
                  <Box>
                    <Typography variant="subtitle2">{item.name}</Typography>
                    <Typography variant="caption" className="feedback-date">{item.date}</Typography>
                  </Box>
                </Box>
                <Rating value={item.rating} readOnly size="small" />
              </Box>
              
              <Typography variant="body2" className="feedback-message">
                <FormatQuoteIcon className="quote-icon" />
                {item.comment}
              </Typography>
              
              <Box className="feedback-actions">
                <Button 
                  size="small" 
                  startIcon={<CheckCircleIcon />}
                  className="btn-respond"
                  onClick={() => handleRespondToFeedback(item)}
                >
                  Respond
                </Button>
                <IconButton 
                  size="small" 
                  className="action-btn delete-btn"
                  onClick={() => onDeleteFeedback(item.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      </Paper>

      <FeedbackResponseDialog
        open={feedbackResponseDialog}
        feedbackItem={selectedFeedback}
        onClose={() => setFeedbackResponseDialog(false)}
      />
    </motion.div>
  );
};

export default Feedback;