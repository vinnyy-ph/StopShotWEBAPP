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
  TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface FeedbackResponseDialogProps {
  open: boolean;
  feedbackItem: any;
  onClose: () => void;
}

const FeedbackResponseDialog: React.FC<FeedbackResponseDialogProps> = ({
  open,
  feedbackItem,
  onClose
}) => {
  const [responseText, setResponseText] = useState('');

  const handleSendResponse = () => {
    // In a real app, this would send data to backend
    // Here we just close the dialog and reset state
    alert('Response sent to ' + feedbackItem?.name);
    setResponseText('');
    onClose();
  };

  if (!feedbackItem) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="feedback-response-dialog"
    >
      <DialogTitle className="dialog-title">
        Respond to Feedback
        <IconButton
          onClick={onClose}
          size="small"
          className="dialog-close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="dialog-content">
        <Typography variant="subtitle2">Customer</Typography>
        <Typography variant="body1" className="detail-value">{feedbackItem.name}</Typography>
        <Typography variant="subtitle2">Feedback</Typography>
        <Typography variant="body1" className="detail-value">{feedbackItem.comment}</Typography>
        <TextField
          label="Response"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button 
          onClick={onClose} 
          className="dialog-btn cancel-btn"
        >
          Cancel
        </Button>
        <Button 
          variant="contained"
          className="dialog-btn confirm-btn"
          onClick={handleSendResponse}
          disabled={!responseText.trim()}
        >
          Send Response
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackResponseDialog;