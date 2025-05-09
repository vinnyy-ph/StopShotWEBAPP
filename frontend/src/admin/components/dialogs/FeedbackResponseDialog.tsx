// admin/components/dialogs/FeedbackResponseDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  TextField,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

interface FeedbackResponseDialogProps {
  open: boolean;
  feedbackItem: any;
  onClose: () => void;
  onResponseSent?: () => void; // Optional callback for refreshing the list
}

const FeedbackResponseDialog: React.FC<FeedbackResponseDialogProps> = ({
  open,
  feedbackItem,
  onClose,
  onResponseSent
}) => {
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper function to get user's name from the feedback item
  const getUserName = (item: any) => {
    if (item && item.user) {
      return `${item.user.first_name || ''} ${item.user.last_name || ''}`.trim() || item.user.email;
    }
    return item?.name || 'Anonymous'; // Fallback to legacy format or anonymous
  };

  const handleSendResponse = async () => {
    if (!responseText.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Call the backend API to send the response
      await axios.post(
        `http://127.0.0.1:8000/api/feedback/${feedbackItem.feedback_id}/response/`, 
        { response_text: responseText },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('authToken')}`
          }
        }
      );
      
      // Reset form
      setResponseText('');
      
      // Call optional callback to refresh the feedback list
      if (onResponseSent) {
        onResponseSent();
      }
      
      onClose();
    } catch (err) {
      console.error('Error sending feedback response:', err);
      setError('Failed to send response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!feedbackItem) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="feedback-response-dialog"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle className="dialog-title">
        Respond to Feedback
        <IconButton
          onClick={onClose}
          size="small"
          className="dialog-close"
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="dialog-content">
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Typography variant="subtitle2">Customer</Typography>
        <Typography variant="body1" className="detail-value">{getUserName(feedbackItem)}</Typography>
        
        <Typography variant="subtitle2">Rating</Typography>
        <Typography variant="body1" className="detail-value">
          {feedbackItem.experience_rating} / 5
        </Typography>
        
        <Typography variant="subtitle2">Feedback</Typography>
        <Typography variant="body1" className="detail-value">{feedbackItem.feedback_text}</Typography>
        
        <TextField
          label="Your Response"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          margin="normal"
          disabled={loading}
          placeholder="Type your response to the customer here..."
        />
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button 
          onClick={onClose} 
          className="dialog-btn cancel-btn"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          variant="contained"
          className="dialog-btn confirm-btn"
          onClick={handleSendResponse}
          disabled={loading || !responseText.trim()}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Send Response"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackResponseDialog;