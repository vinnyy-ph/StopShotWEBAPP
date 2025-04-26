import React, { useState } from 'react';
import { Paper, Box, Typography, TextField, InputAdornment, IconButton, Rating, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import { motion, AnimatePresence } from 'framer-motion';
import { mockFeedback } from '../data/mockData';

const FeedbackSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredFeedback = mockFeedback.filter(feedback =>
    feedback.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feedback.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate feedback stats
  const totalFeedback = filteredFeedback.length;
  const averageRating = filteredFeedback.reduce((acc, item) => acc + item.rating, 0) / totalFeedback;
  
  // Count ratings by star
  const ratingCounts = [0, 0, 0, 0, 0]; // 1 to 5 stars
  filteredFeedback.forEach(item => {
    ratingCounts[item.rating - 1]++;
  });

  return (
    <AnimatePresence mode="wait">
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
                <Typography className="summary-value">
                  {averageRating.toFixed(1)}
                </Typography>
              </Box>
              <Rating value={averageRating} precision={0.1} readOnly />
            </Paper>
            
            <Paper className="summary-card">
              <Box className="summary-content">
                <Typography className="summary-title">Rating Distribution</Typography>
                <Typography className="summary-value">
                  {totalFeedback} Total
                </Typography>
              </Box>
              <Box className="rating-breakdown">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <Box key={stars} className="rating-bar">
                    <Typography variant="body2">{stars}★</Typography>
                    <Box className="bar-container">
                      <Box 
                        className="bar-fill" 
                        style={{ 
                          width: `${(ratingCounts[stars - 1] / totalFeedback) * 100}%` 
                        }} 
                      />
                    </Box>
                    <Typography variant="body2">{ratingCounts[stars - 1]}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
          
          <Box className="feedback-grid">
            {filteredFeedback.map((feedback) => (
              <Paper key={feedback.id} className="feedback-card">
                <Box className="feedback-card-header">
                  <Box className="feedback-user">
                    <Avatar className="feedback-avatar">
                      {feedback.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">{feedback.name}</Typography>
                      <Rating value={feedback.rating} readOnly size="small" />
                    </Box>
                  </Box>
                  <Typography className="feedback-date" variant="caption">
                    {feedback.date}
                  </Typography>
                </Box>
                <Typography className="feedback-message" variant="body2">
                  <FormatQuoteIcon className="quote-icon" fontSize="small" />
                  {feedback.comment}
                </Typography>
                <Box className="feedback-actions">
                  <Chip 
                    size="small"
                    label={feedback.rating === 5 ? "Excellent" : 
                          feedback.rating === 4 ? "Good" :
                          feedback.rating === 3 ? "Average" :
                          "Needs Attention"}
                    color={feedback.rating >= 4 ? "success" :
                           feedback.rating === 3 ? "warning" :
                           "error"}
                  />
                  <Button 
                    size="small" 
                    className="btn-respond"
                    startIcon={<ReplyIcon fontSize="small" />}
                  >
                    Respond
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        </Paper>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeedbackSection;