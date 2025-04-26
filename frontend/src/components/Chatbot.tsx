import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  Avatar,
  Fab,
  Badge,
  Tooltip,
  Zoom,
  Chip as MuiChip, // Renamed Chip to avoid conflict
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'; // Import specific types
// Import ResizableBox and its types
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css'; // Import default styles

// FAQ database
const faqs = [
  {
    keywords: ['hour', 'time', 'open', 'close', 'business'],
    answer: 'We are open Monday to Sunday from 4PM to 2AM.'
  },
  {
    keywords: ['location', 'address', 'where', 'find', 'place'],
    answer: 'We are located at 358 M. Vicente St, Brgy. Malamig, Mandaluyong City.'
  },
  {
    keywords: ['reservation', 'book', 'table', 'reserve'],
    answer: 'You can make a reservation through our website or by calling us at (02) 8123-4567.'
  },
  {
    keywords: ['menu', 'food', 'drink', 'offer', 'serve'],
    answer: 'We offer a variety of drinks, cocktails, and bar food. Check our Menu page for details!'
  },
  {
    keywords: ['event', 'show', 'entertainment', 'live', 'music'],
    answer: 'We host live music events and karaoke nights regularly. Follow our social media for event schedules!'
  },
  {
    keywords: ['parking', 'park', 'car', 'vehicle'],
    answer: 'We have free parking space available for our customers.'
  },
  {
    keywords: ['billiards', 'pool', 'table', 'game'],
    answer: 'Yes, we have professional billiards tables available for our customers.'
  },
  {
    keywords: ['karaoke', 'sing', 'song', 'ktv'],
    answer: 'We have private karaoke rooms that you can reserve for your party.'
  },
  {
    keywords: ['help', 'assist', 'support', 'information'],
    answer: 'I can answer questions about our hours, location, menu, reservations, and facilities. What would you like to know?'
  }
];

// Suggestions for user
const suggestions = [
  "What are your hours?",
  "Where are you located?",
  "How do I make a reservation?",
  "Tell me about your menu",
  "Do you have parking?"
];

// Bot responds to user query
const getBotResponse = (userMessage: string) => {
  const lowercaseMessage = userMessage.toLowerCase();

  // Check for greetings
  if (/hi|hello|hey|greetings/i.test(lowercaseMessage)) {
    return "Hello! How can I help you today? 😊";
  }

  // Check for thanks
  if (/thank|thanks|appreciate/i.test(lowercaseMessage)) {
    return "You're welcome! Is there anything else I can help with? 🍻";
  }

  // Check against keywords
  for (const faq of faqs) {
    if (faq.keywords.some(keyword => lowercaseMessage.includes(keyword))) {
      return faq.answer;
    }
  }

  // Default response
  return "I'm sorry, I don't have information on that. For specific questions, please call us at (02) 8123-4567 or visit our Contact page. 📞";
};


interface Message {
  text: string;
  isBot: boolean;
  isTyping?: boolean;
}

// Define position type
type Position = { x: number; y: number };

const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! How can I help you with Stop Shot Sports Bar today? 🎱", isBot: true }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useState(false);
  // Initial dimensions for ResizableBox
  const [dimensions, setDimensions] = useState({ width: 320, height: 450 });
  // Initialize position state with a default object
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  // Track if the component has been dragged at least once
  const [hasDragged, setHasDragged] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Correctly type the nodeRef for Draggable
  const nodeRef = useRef<HTMLDivElement>(null);

  // Periodically animate the chat button when closed
  useEffect(() => {
    if (!open) {
      const interval = setInterval(() => {
        setPulseAnimation(true);
        setTimeout(() => setPulseAnimation(false), 1500);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [open]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Suggest a tip after 30 seconds of inactivity
  useEffect(() => {
    if (open && messages.length <= 2) {
      const timeout = setTimeout(() => {
        const suggestedTip = "💡 Tip: You can ask me about our hours, location, menu or how to make a reservation.";
        setMessages(prev => [...prev, { text: suggestedTip, isBot: true }]);
      }, 30000);
      return () => clearTimeout(timeout);
    }
  }, [open, messages]);


  const handleToggleChat = () => {
    setOpen(!open);
    if (!open) {
      setNotification(false);
      // Reset position state and dragged status when closing
      setPosition({ x: 0, y: 0 });
      setHasDragged(false);
      // Optionally reset dimensions when closing
      // setDimensions({ width: 320, height: 450 });
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const updatedMessages = [
      ...messages,
      { text: inputText, isBot: false }
    ];
    setMessages(updatedMessages);
    setInputText("");

    // Show typing indicator
    setIsTyping(true);
    // Add typing indicator message immediately
    setMessages(current => [...current, { text: "", isBot: true, isTyping: true }]);

    // Get bot response with a realistic delay
    const responseTime = Math.max(600, inputText.length * 40);
    setTimeout(() => {
      const botResponse = getBotResponse(inputText);
      setIsTyping(false);
      // Replace typing indicator with the actual response
      setMessages(current =>
        current.filter(msg => !msg.isTyping).concat([{ text: botResponse, isBot: true }])
      );
    }, responseTime);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    // Focus the input field after setting the suggestion
    const inputField = document.getElementById('chat-input-field');
    if (inputField) {
      inputField.focus();
    }
  };


  // Correctly type the event and data parameters
  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    setPosition({ x: data.x, y: data.y });
    setHasDragged(true); // Mark as dragged
  };

  // Add handleResizeStop function
  const handleResizeStop = (_e: React.SyntheticEvent, data: ResizeCallbackData) => {
    setDimensions({
      width: data.size.width,
      height: data.size.height,
    });
  };

  // Trigger notification when component mounts
  useEffect(() => {
    setTimeout(() => setNotification(true), 5000);
  }, []);

  return (
    // This outer Box acts as the boundary for the Draggable component
    <Box sx={{ position: 'fixed', bottom: 0, right: 0, top: 0, left: 0, pointerEvents: 'none', zIndex: 1000 }}>
      {open ? (
        <Draggable
          nodeRef={nodeRef} // Pass the correctly typed ref
          handle=".drag-handle" // Only allow dragging from the header
          bounds="parent" // Keep within the viewport boundary Box
          position={hasDragged ? position : undefined} // Controlled position after first drag
          defaultPosition={{ x: 0, y: 0 }} // Initial position relative to bottom-right corner logic below
          onStop={handleDragStop}
          // Cancel dragging if the resize handle is the target
          cancel=".react-resizable-handle"
        >
          {/* This Box is the draggable element */}
          <Box
            ref={nodeRef} // Draggable needs this ref
            sx={{
              position: 'absolute',
              bottom: 20, // Initial position
              right: 20, // Initial position
              pointerEvents: 'auto', // Allow interactions within this box
              // Width and height are now controlled by ResizableBox
              // width: dimensions.width,
              // height: dimensions.height,
              // Max width/height constraints can be applied here or in ResizableBox
              maxWidth: 'calc(100vw - 40px)',
              maxHeight: 'calc(100vh - 40px)',
              // Add overflow hidden to prevent content spill during resize animation
              overflow: 'hidden',
              // Apply border radius here if needed, or on Paper/ResizableBox
              borderRadius: 2,
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)', // Apply shadow here for consistency
            }}
          >
            {/* ResizableBox wraps the Paper content */}
            <ResizableBox
              width={dimensions.width}
              height={dimensions.height}
              onResizeStop={handleResizeStop}
              minConstraints={[280, 300]} // Minimum size
              maxConstraints={[600, window.innerHeight - 40]} // Maximum size (adjust as needed)
              style={{
                // Ensure the resizable box itself doesn't add extra margins/paddings
                position: 'relative', // Needed for handle positioning
              }}
              // You can customize resize handles if needed
              // handle={<span className="custom-handle" />}
            >
              {/* Paper component now fills the ResizableBox */}
              <Paper
                elevation={0} // Elevation is handled by the outer Box now
                sx={{
                  width: '100%', // Fill ResizableBox width
                  height: '100%', // Fill ResizableBox height
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 'inherit', // Inherit border radius from parent Box
                  overflow: 'hidden', // Ensure content stays within Paper
                  animation: 'fadeIn 0.3s ease-out',
                  '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'translateY(20px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                  }
                  // Remove direct shadow if applied on the outer Box
                  // boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                }}
              >
                {/* Chat Header (Draggable Handle) */}
                <Box sx={{
                  bgcolor: '#d38236',
                  color: 'white',
                  p: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'move', // Indicate draggable area
                  userSelect: 'none', // Prevent text selection during drag
                  flexShrink: 0, // Prevent header from shrinking
                }}
                  className="drag-handle" // Class used by Draggable handle prop
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DragIndicatorIcon sx={{ mr: 1 }} />
                    <Avatar sx={{ mr: 1, bgcolor: '#fff' }}>
                      <SportsBarIcon sx={{ color: '#d38236' }} />
                    </Avatar>
                    <Typography variant="h6" sx={{
                      fontWeight: 'bold',
                      textShadow: '0px 1px 2px rgba(0,0,0,0.2)'
                    }}>
                      StopShot Assistant
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={handleToggleChat} sx={{ color: 'white' }}>
                    <CloseIcon />
                  </IconButton>
                </Box>

                {/* Chat Messages */}
                <Box sx={{
                  flexGrow: 1, // Allow this section to grow and fill space
                  overflow: 'auto', // Enable scrolling for messages
                  p: 2,
                  bgcolor: '#f8f8f8',
                  backgroundImage: 'radial-gradient(circle at center, #f8f8f8 0%, #eaeaea 100%)',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <List sx={{ width: '100%', padding: 0 }}> {/* Ensure list takes full width */}
                    {messages.map((message, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          justifyContent: message.isBot ? 'flex-start' : 'flex-end',
                          mb: 1.5,
                          alignItems: 'flex-start',
                          padding: 0, // Remove default ListItem padding
                          animation: 'slideIn 0.3s ease-out',
                          '@keyframes slideIn': {
                            from: {
                              opacity: 0,
                              transform: message.isBot
                                ? 'translateX(-20px)'
                                : 'translateX(20px)'
                            },
                            to: {
                              opacity: 1,
                              transform: 'translateX(0)'
                            }
                          }
                        }}
                      >
                        {message.isBot && (
                          <Avatar
                            src="public/image/logo.png" // Ensure this path is correct relative to public folder
                            sx={{
                              width: 36,
                              height: 36,
                              mr: 1,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          />
                        )}
                        <Box
                          sx={{
                            bgcolor: message.isBot ? '#ffffff' : '#d38236',
                            color: message.isBot ? 'text.primary' : '#fff',
                            borderRadius: message.isBot ? '0 12px 12px 12px' : '12px 0 12px 12px',
                            p: 1.5,
                            maxWidth: '85%',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                            position: 'relative',
                            // Speech bubble arrows (simplified)
                            '&::before': message.isBot ? {
                              content: '""',
                              position: 'absolute',
                              top: '10px', // Adjust vertical position
                              left: -8,
                              width: 0,
                              height: 0,
                              borderTop: '8px solid transparent',
                              borderBottom: '8px solid transparent',
                              borderRight: '8px solid #ffffff',
                            } : {
                              content: '""',
                              position: 'absolute',
                              top: '10px', // Adjust vertical position
                              right: -8,
                              width: 0,
                              height: 0,
                              borderTop: '8px solid transparent',
                              borderBottom: '8px solid transparent',
                              borderLeft: '8px solid #d38236',
                            }
                          }}
                        >
                          {message.isTyping ? (
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              p: 1, // Adjusted padding
                              minHeight: '24px' // Adjusted height
                            }}>
                              {/* Typing indicator dots */}
                              {[0, 1, 2].map((i) => (
                                <Box
                                  key={i}
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    // Use a slightly darker color for typing dots if needed
                                    backgroundColor: message.isBot ? '#b0bec5' : '#ffcc80',
                                    margin: '0 3px',
                                    animation: 'bounce 1.2s infinite ease-in-out',
                                    animationDelay: `${i * 0.2}s`,
                                    '@keyframes bounce': {
                                      '0%, 80%, 100%': { transform: 'scale(0)' },
                                      '40%': { transform: 'scale(1.0)' }
                                    }
                                  }}
                                />
                              ))}
                            </Box>
                          ) : (
                            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                              {message.text}
                            </Typography>
                          )}
                        </Box>
                      </ListItem>
                    ))}
                    <div ref={messagesEndRef} /> {/* For auto-scrolling */}
                  </List>
                </Box>

                {/* Quick Suggestions */}
                {messages.length <= 3 && (
                  <Box sx={{
                    p: 1,
                    bgcolor: '#f0f0f0',
                    display: 'flex',
                    overflowX: 'auto', // Allow horizontal scrolling for chips
                    borderTop: '1px solid #e0e0e0',
                    '&::-webkit-scrollbar': { height: '4px' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#d38236', borderRadius: '4px' },
                    flexShrink: 0, // Prevent suggestions from shrinking
                  }}>
                    {suggestions.map((suggestion, index) => (
                      // Use MuiChip for consistency
                      <MuiChip
                        key={index}
                        label={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        variant="outlined" // Use outlined variant
                        size="small" // Use small size
                        sx={{
                          m: 0.5,
                          borderColor: '#d38236',
                          color: '#d38236',
                          '&:hover': {
                            backgroundColor: 'rgba(211, 130, 54, 0.1)', // Lighter hover
                            borderColor: '#b06b2c', // Darker border on hover
                          },
                          cursor: 'pointer',
                          whiteSpace: 'nowrap', // Prevent wrapping
                          animation: 'fadeInUp 0.5s ease forwards',
                          animationDelay: `${index * 0.1}s`,
                          opacity: 0,
                          '@keyframes fadeInUp': {
                            from: { opacity: 0, transform: 'translateY(10px)' },
                            to: { opacity: 1, transform: 'translateY(0)' }
                          }
                        }}
                      />
                    ))}
                  </Box>
                )}

                {/* Chat Input */}
                <Box sx={{
                  p: 1.5,
                  bgcolor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center', // Align items vertically
                  borderTop: '1px solid #e0e0e0',
                  flexShrink: 0, // Prevent input from shrinking
                }}>
                  <TextField
                    id="chat-input-field"
                    fullWidth
                    placeholder="Type your question..."
                    variant="outlined"
                    size="small"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    sx={{
                      mr: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '24px', // Rounded input field
                        backgroundColor: '#fff', // White background for input
                        '& fieldset': { borderColor: '#d0d0d0' },
                        '&:hover fieldset': { borderColor: '#d38236' },
                        '&.Mui-focused fieldset': { borderColor: '#d38236' }
                      }
                    }}
                  />
                  <Tooltip title="Send message" placement="top" TransitionComponent={Zoom}>
                    {/* Ensure IconButton doesn't shrink */}
                    <Box sx={{ flexShrink: 0 }}>
                      <IconButton
                        color="primary"
                        onClick={handleSendMessage}
                        disabled={!inputText.trim()} // Disable if input is empty
                        sx={{
                          bgcolor: '#d38236',
                          color: 'white',
                          '&:hover': {
                            bgcolor: '#b06b2c',
                            transform: 'scale(1.05)'
                          },
                          '&:disabled': { // Style for disabled state
                            bgcolor: '#e0e0e0',
                            cursor: 'not-allowed'
                          },
                          transition: 'all 0.2s ease',
                          width: 40, // Explicit size
                          height: 40 // Explicit size
                        }}
                      >
                        <SendIcon />
                      </IconButton>
                    </Box>
                  </Tooltip>
                </Box>
              </Paper>
            </ResizableBox>
          </Box>
        </Draggable>
      ) : (
        // FAB Button remains outside Draggable, positioned by the outer Box
        <Badge
          badgeContent={notification ? "1" : 0}
          color="error"
          sx={{
            position: 'absolute', // Position relative to the outer Box
            bottom: 20,
            right: 20,
            pointerEvents: 'auto', // Allow clicks on the FAB
            '& .MuiBadge-badge': {
              animation: notification ? 'pulse 1.5s infinite' : 'none',
              '@keyframes pulse': {
                '0%': { transform: 'scale(0.8)', boxShadow: '0 0 0 0 rgba(255, 0, 0, 0.7)' },
                '50%': { transform: 'scale(1.2)', boxShadow: '0 0 0 10px rgba(255, 0, 0, 0)' },
                '100%': { transform: 'scale(0.8)', boxShadow: '0 0 0 0 rgba(255, 0, 0, 0)' }
              }
            }
          }}
        >
          <Tooltip title="Chat with us" placement="left" arrow>
            <Fab
              color="primary"
              aria-label="chat"
              onClick={handleToggleChat}
              sx={{
                bgcolor: '#d38236',
                '&:hover': {
                  bgcolor: '#b06b2c',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease',
                animation: pulseAnimation
                  ? 'chatButtonPulse 1.5s ease-out'
                  : 'none',
                '@keyframes chatButtonPulse': {
                  '0%': { boxShadow: '0 0 0 0 rgba(211, 130, 54, 0.7)' },
                  '70%': { boxShadow: '0 0 0 15px rgba(211, 130, 54, 0)' },
                  '100%': { boxShadow: '0 0 0 0 rgba(211, 130, 54, 0)' }
                }
              }}
            >
              <ChatIcon />
            </Fab>
          </Tooltip>
        </Badge>
      )}
    </Box>
  );
};

export default Chatbot;