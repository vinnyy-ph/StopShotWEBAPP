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
  Chip as MuiChip,
  Divider,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import StarIcon from '@mui/icons-material/Star';
import MinimizeIcon from '@mui/icons-material/Minimize';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import NightlifeIcon from '@mui/icons-material/Nightlife';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import '../styles/components/chatbot.css';

// FAQ database
const faqs = [
  {
    keywords: ['hour', 'time', 'open', 'close', 'business'],
    answer: 'We are open Monday to Sunday from 4PM to 2AM. Come enjoy the night with us! 🕺'
  },
  {
    keywords: ['location', 'address', 'where', 'find', 'place'],
    answer: 'We are located at 358 M. Vicente St, Brgy. Malamig, Mandaluyong City. Easy to find with great parking! 📍'
  },
  {
    keywords: ['reservation', 'book', 'table', 'reserve'],
    answer: 'You can make a reservation through our website\'s Reservation page or by calling us at (02) 8123-4567. We recommend booking ahead on game nights! 📅'
  },
  {
    keywords: ['menu', 'food', 'drink', 'offer', 'serve'],
    answer: 'Our menu features craft beers, signature cocktails, and amazing bar food like our famous wings and loaded nachos! Check our Menu page for the full experience. 🍻🍔'
  },
  {
    keywords: ['event', 'show', 'entertainment', 'live', 'music', 'game', 'watch'],
    answer: 'We show all major sports events on our big screens! We also host live music events and karaoke nights regularly. Follow our social media for event schedules! 🏀🎸'
  },
  {
    keywords: ['parking', 'park', 'car', 'vehicle'],
    answer: 'Yes! We have free parking space available for our customers. No need to worry about where to leave your car. 🚗'
  },
  {
    keywords: ['billiards', 'pool', 'table', 'game'],
    answer: 'We have 8 professional billiards tables available. First come, first served, but you can reserve them for tournaments or private events! 🎱'
  },
  {
    keywords: ['karaoke', 'sing', 'song', 'ktv'],
    answer: 'Our 5 private karaoke rooms are perfect for parties! Each room fits 4-12 people and has its own service button for drinks. Book in advance on weekends! 🎤'
  },
  {
    keywords: ['help', 'assist', 'support', 'information'],
    answer: 'I can answer questions about our hours, location, menu, reservations, and facilities. What would you like to know? Just ask away! 💬'
  }
];

// Suggestions for user
const suggestions = [
  "What are your hours?",
  "Where are you located?",
  "How do I make a reservation?",
  "Tell me about your menu",
  "Do you show NBA games?",
  "Do you have parking?",
  "How many pool tables do you have?"
];

// Testimonials for the marquee
const testimonials = [
  { name: "Mike J.", text: "Best wings and beer selection in town! The NBA finals night was epic!", rating: 5 },
  { name: "Sarah T.", text: "Love the atmosphere! Great place to hang out with friends.", rating: 5 },
  { name: "David R.", text: "The karaoke rooms are fantastic for birthday parties!", rating: 5 },
  { name: "Kimberly L.", text: "Amazing staff and service. Always my go-to spot on weekends.", rating: 5 },
  { name: "Jason M.", text: "Great screens for watching sports and the drinks are perfect.", rating: 4 },
  { name: "Emily P.", text: "The pool tables are always in perfect condition. Great vibe!", rating: 5 },
  { name: "Robert W.", text: "This is where I bring all my out-of-town friends. Never disappoints!", rating: 5 }
];

// Bot responds to user query
const getBotResponse = (userMessage: string) => {
  const lowercaseMessage = userMessage.toLowerCase();

  // Check for greetings
  if (/hi|hello|hey|greetings/i.test(lowercaseMessage)) {
    return "Hey there! Welcome to StopShot! How can I help you tonight? 😊🍻";
  }

  // Check for thanks
  if (/thank|thanks|appreciate/i.test(lowercaseMessage)) {
    return "You're welcome! That's what I'm here for! Anything else you want to know about StopShot? 🎱";
  }

  // Check for goodbye
  if (/bye|goodbye|see you|later/i.test(lowercaseMessage)) {
    return "Hope to see you at StopShot soon! Have a great day! 👋";
  }

  // Check against keywords
  for (const faq of faqs) {
    if (faq.keywords.some(keyword => lowercaseMessage.includes(keyword))) {
      return faq.answer;
    }
  }

  // Default response
  return "I'm not sure about that, but our friendly staff can help you with any specific questions! Call us at (02) 8123-4567 or drop by and ask in person. We love to chat! 🍻";
};

interface Message {
  text: string;
  isBot: boolean;
  isTyping?: boolean;
}

type Position = { x: number; y: number };

const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hey! What's up? How can I help you enjoy StopShot Sports Bar? 🎱🍻", isBot: true }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 340, height: 480 });
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [showTestimonials, setShowTestimonials] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

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
        const suggestedTip = "💡 Tip: You can ask me about our hours, menu, games, or special events!";
        setMessages(prev => [...prev, { text: suggestedTip, isBot: true }]);
      }, 25000);
      return () => clearTimeout(timeout);
    }
  }, [open, messages]);

  // Focus input field when chat opens
  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 300);
    }
  }, [open, minimized]);

  // Show special message at night
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 20 || hour < 4) { // Between 8pm and 4am
      setTimeout(() => {
        if (messages.length === 1) {
          setMessages(prev => [...prev, { 
            text: "Looking for late-night fun? We're open until 2AM every day! 🌙✨", 
            isBot: true 
          }]);
        }
      }, 10000);
    }
  }, [messages]);

  const handleToggleChat = () => {
    setOpen(!open);
    setMinimized(false);
    if (!open) {
      setNotification(false);
      setPosition({ x: 0, y: 0 });
      setHasDragged(false);
    }
  };

  const handleMinimizeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMinimized(!minimized);
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

    // Hide testimonials once conversation starts
    setShowTestimonials(false);

    // Show typing indicator
    setIsTyping(true);
    setMessages(current => [...current, { text: "", isBot: true, isTyping: true }]);

    // Get bot response with a realistic delay
    const responseTime = Math.max(600, inputText.length * 35);
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
    chatInputRef.current?.focus();
  };

  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    setPosition({ x: data.x, y: data.y });
    setHasDragged(true);
  };

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
    <Box className="chatbot-container">
      {open ? (
        <Draggable
          nodeRef={nodeRef}
          handle=".drag-handle"
          bounds="parent"
          position={hasDragged ? position : undefined}
          defaultPosition={{ x: 0, y: 0 }}
          onStop={handleDragStop}
          cancel=".react-resizable-handle"
        >
          <Box
            ref={nodeRef}
            className={`chatbot-draggable ${minimized ? 'minimized' : ''}`}
            sx={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              pointerEvents: 'auto',
              maxWidth: 'calc(100vw - 40px)',
              maxHeight: 'calc(100vh - 40px)',
              overflow: 'hidden',
              borderRadius: 2,
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              transition: 'height 0.3s ease',
            }}
          >
            {minimized ? (
              // Minimized Header Bar
              <Box
                className="chatbot-minimized-header drag-handle"
                sx={{
                  bgcolor: '#1e1e1e',
                  color: 'white',
                  p: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'move',
                  userSelect: 'none',
                  borderRadius: 2,
                  width: 280,
                  backgroundImage: 'linear-gradient(to right, #d38236, #a34d00)',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                }}
                onClick={handleMinimizeChat}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar className="chatbot-avatar">
                    <SportsBarIcon />
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'bold' }}>
                    StopShot Assistant
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <IconButton 
                    size="small" 
                    onClick={handleMinimizeChat} 
                    className="minimize-btn"
                    sx={{ color: 'white' }}
                  >
                    <OpenInFullIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={handleToggleChat}
                    className="close-btn"
                    sx={{ color: 'white' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
            ) : (
              // Full Chat Interface
              <ResizableBox
                width={dimensions.width}
                height={dimensions.height}
                onResizeStop={handleResizeStop}
                minConstraints={[300, 400]}
                maxConstraints={[600, window.innerHeight - 40]}
                className="chatbot-resizable"
              >
                <Paper
                  elevation={0}
                  className="chatbot-paper"
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundColor: '#121212',
                    backgroundImage: 'linear-gradient(to bottom right, rgba(211, 130, 54, 0.05), rgba(0, 0, 0, 0))',
                    color: '#fff',
                  }}
                >
                  {/* Chat Header */}
                  <Box 
                    className="chatbot-header drag-handle"
                    sx={{
                      backgroundImage: 'linear-gradient(to right, #d38236, #a34d00)',
                      color: 'white',
                      p: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'move',
                      userSelect: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DragIndicatorIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.7)' }} />
                      <Avatar 
                        className="chatbot-avatar" 
                        sx={{ bgcolor: '#1e1e1e', mr: 1 }}
                      >
                        <SportsBarIcon sx={{ color: '#d38236' }} />
                      </Avatar>
                      <Typography variant="h6" className="chatbot-title">
                        StopShot Assistant
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={handleMinimizeChat}
                        className="minimize-btn"
                      >
                        <MinimizeIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={handleToggleChat}
                        className="close-btn"
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Chat Messages */}
                  <Box
                    className="chatbot-messages"
                    sx={{
                      flexGrow: 1,
                      overflow: 'auto',
                      p: 2,
                      bgcolor: '#1a1a1a',
                      backgroundImage: `
                        radial-gradient(circle at 20% 35%, rgba(211, 130, 54, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 75% 65%, rgba(211, 130, 54, 0.1) 0%, transparent 50%)
                      `,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Testimonials Marquee */}
                    {showTestimonials && (
                      <Box className="testimonials-container">
                        <Box className="testimonials-header">
                          <NightlifeIcon className="testimonial-icon" />
                          <Typography variant="subtitle2">
                            What people are saying
                          </Typography>
                        </Box>
                        <Box className="testimonials-marquee-container">
                          <Box className="testimonials-marquee">
                            {[...testimonials, ...testimonials].map((testimonial, index) => (
                              <Box key={index} className="testimonial-item">
                                <Typography variant="body2" className="testimonial-text">
                                  <FormatQuoteIcon className="quote-icon" fontSize="small" />
                                  {testimonial.text}
                                </Typography>
                                <Box className="testimonial-footer">
                                  <Typography variant="caption" className="testimonial-name">
                                    {testimonial.name}
                                  </Typography>
                                  <Box className="testimonial-rating">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                      <StarIcon key={i} fontSize="small" />
                                    ))}
                                  </Box>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    )}
                    
                    {/* Chat Messages List */}
                    <List className="messages-list">
                      {messages.map((message, index) => (
                        <ListItem
                          key={index}
                          className={`message-item ${message.isBot ? 'bot-message' : 'user-message'}`}
                        >
                          {message.isBot && (
                            <Avatar
                              className="message-avatar"
                              sx={{
                                bgcolor: message.isBot ? '#d38236' : '#424242',
                              }}
                            >
                              {message.isBot ? <SportsBasketballIcon /> : null}
                            </Avatar>
                          )}
                          <Box
                            className={`message-bubble ${message.isBot ? 'bot-bubble' : 'user-bubble'}`}
                          >
                            {message.isTyping ? (
                              <Box className="typing-indicator">
                                {[0, 1, 2].map((i) => (
                                  <Box
                                    key={i}
                                    className="typing-dot"
                                  />
                                ))}
                              </Box>
                            ) : (
                              <Typography variant="body1" className="message-text">
                                {message.text}
                              </Typography>
                            )}
                          </Box>
                        </ListItem>
                      ))}
                      <div ref={messagesEndRef} />
                    </List>
                  </Box>

                  {/* Quick Suggestions */}
                  {messages.length <= 3 && (
                    <Box className="suggestions-container">
                      <Divider className="suggestions-divider" />
                      {suggestions.map((suggestion, index) => (
                        <MuiChip
                          key={index}
                          label={suggestion}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="suggestion-chip"
                        />
                      ))}
                    </Box>
                  )}

                  {/* Chat Input */}
                  <Box className="chatbot-input-container">
                    <TextField
                      inputRef={chatInputRef}
                      fullWidth
                      placeholder="Type your question..."
                      variant="outlined"
                      size="small"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="chatbot-input-field"
                    />
                    <Tooltip title="Send message" placement="top" TransitionComponent={Zoom}>
                      <Box sx={{ flexShrink: 0 }}>
                        <IconButton
                          onClick={handleSendMessage}
                          disabled={!inputText.trim()}
                          className={`send-button ${!inputText.trim() ? 'disabled' : ''}`}
                        >
                          <SendIcon />
                        </IconButton>
                      </Box>
                    </Tooltip>
                  </Box>
                </Paper>
              </ResizableBox>
            )}
          </Box>
        </Draggable>
      ) : (
        // Chat Button with Notification Badge
        <Box className="chat-button-container">
          <Badge
            badgeContent={notification ? "1" : 0}
            color="error"
            className="chat-notification-badge"
          >
            <Tooltip title="Chat with us" placement="left" arrow>
              <Fab
                aria-label="chat"
                onClick={handleToggleChat}
                className={`chat-fab-button ${pulseAnimation ? 'pulse' : ''}`}
              >
                <ChatIcon />
              </Fab>
            </Tooltip>
          </Badge>
        </Box>
      )}
    </Box>
  );
};

export default Chatbot;