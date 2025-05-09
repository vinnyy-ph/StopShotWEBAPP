import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  TextField, 
  Button, 
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  FormHelperText
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import PersonIcon from '@mui/icons-material/Person';
import SubjectIcon from '@mui/icons-material/Subject';
import SendIcon from '@mui/icons-material/Send';
import '../styles/pages/contactpage.css';

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  
  // Validate email format
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  // Validate Philippine phone number format (09XXXXXXXXX or +639XXXXXXXX)
  const validatePhoneNumber = (phone: string) => {
    if (!phone) return true; // Phone is optional
    const regex = /^(09|\+639)\d{9}$/;
    return regex.test(phone);
  };
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const email = formData.get('email') as string;
    const phone = formData.get('phone_number') as string;
    
    // Reset validation errors
    setEmailError("");
    setPhoneError("");
    
    // Validate email and phone
    let isValid = true;
    
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }
    
    if (phone && !validatePhoneNumber(phone)) {
      setPhoneError("Please enter a valid Philippine phone number (09XXXXXXXXX or +639XXXXXXXX)");
      isValid = false;
    }
    
    if (!isValid) return;
    
    // Create payload matching backend requirements
    const payload = {
      email: email,
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      phone_number: phone,
      message_text: formData.get('message_text')
    };
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/message/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }
      
      setSubmitted(true);
      setOpen(true);
      setIsError(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(error.message || 'Failed to send message. Please try again.');
      setIsError(true);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box className="contact-page" sx={{ backgroundColor: '#121212', pt: 2, pb: 10 }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Hero Section */}
        <Box 
          className="contact-hero" 
          sx={{ 
            textAlign: 'center', 
            mb: 6,
            position: 'relative',
            overflow: 'hidden',
            pt: 2
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 2
            }}
          >
            <SportsBasketballIcon 
              sx={{ 
                color: '#d38236', 
                fontSize: 40, 
                mr: 2,
                animation: 'bounce 2s infinite' 
              }} 
            />
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700, 
                color: '#fff',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                m: 0
              }}
              className="contact-title"
            >
              Contact Us
            </Typography>
            <SportsSoccerIcon 
              sx={{ 
                color: '#d38236', 
                fontSize: 40, 
                ml: 2,
                animation: 'bounce 2s infinite',
                animationDelay: '0.5s'
              }} 
            />
          </Box>
          
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#bbb',
              maxWidth: '700px',
              mx: 'auto',
              fontSize: '1.1rem'
            }}
            className="contact-subtitle"
          >
            We'd love to hear from you! Reach out with questions, feedback, or to make a reservation.
          </Typography>
          
          <Divider 
            sx={{ 
              mt: 4, 
              mb: 6, 
              backgroundColor: 'rgba(255,255,255,0.1)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '80px',
                height: '3px',
                backgroundColor: '#d38236',
                bottom: '-1px',
                left: '50%',
                transform: 'translateX(-50%)'
              }
            }} 
          />
        </Box>

        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={5} className="info-section">
            <Paper 
              elevation={5} 
              sx={{ 
                p: 3, 
                height: '100%',
                backgroundColor: '#1A1A1A',
                backgroundImage: 'linear-gradient(rgba(40, 40, 40, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(40, 40, 40, 0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                borderRadius: '12px',
                border: '1px solid #333',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
                }
              }}
              className="contact-info-card"
            >
              {/* Orange accent strip */}
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '5px',
                  height: '100%',
                  backgroundColor: '#d38236'
                }} 
              />
              
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  color: '#d38236', 
                  fontWeight: 700,
                  mb: 3,
                  pl: 2,
                  borderLeft: '1px solid #d38236'
                }}
              >
                GET IN TOUCH
              </Typography>
              
              <List sx={{ '.MuiListItem-root': { px: 0, py: 2 } }}>
                <ListItem className="contact-list-item">
                  <ListItemIcon>
                    <Box 
                      className="icon-circle" 
                      sx={{ 
                        backgroundColor: 'rgba(211, 130, 54, 0.15)',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <LocationOnIcon sx={{ color: '#d38236' }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#fff' }}>
                        Address
                      </Typography>
                    } 
                    secondary={
                      <Typography variant="body2" sx={{ color: '#bbb' }}>
                        358 M. Vicente St, Brgy. Malamig, Mandaluyong City
                      </Typography>
                    }
                  />
                </ListItem>
                
                <ListItem className="contact-list-item">
                  <ListItemIcon>
                    <Box 
                      className="icon-circle"
                      sx={{ 
                        backgroundColor: 'rgba(211, 130, 54, 0.15)',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <PhoneIcon sx={{ color: '#d38236' }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#fff' }}>
                        Phone
                      </Typography>
                    } 
                    secondary={
                      <Typography variant="body2" sx={{ color: '#bbb' }}>
                        (02) 8123-4567
                      </Typography>
                    } 
                  />
                </ListItem>
                
                <ListItem className="contact-list-item">
                  <ListItemIcon>
                    <Box 
                      className="icon-circle"
                      sx={{ 
                        backgroundColor: 'rgba(211, 130, 54, 0.15)',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <EmailIcon sx={{ color: '#d38236' }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#fff' }}>
                        Email
                      </Typography>
                    } 
                    secondary={
                      <Typography variant="body2" sx={{ color: '#bbb' }}>
                        stopshot.management@gmail.com
                      </Typography>
                    }
                  />
                </ListItem>
                
                <ListItem className="contact-list-item">
                  <ListItemIcon>
                    <Box 
                      className="icon-circle" 
                      sx={{ 
                        backgroundColor: 'rgba(211, 130, 54, 0.15)',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <AccessTimeIcon sx={{ color: '#d38236' }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#fff' }}>
                        Hours
                      </Typography>
                    } 
                    secondary={
                      <Typography variant="body2" sx={{ color: '#bbb' }}>
                        Monday - Sunday: 4PM - 2AM
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2, backgroundColor: 'rgba(255,255,255,0.1)' }} />
              
              <Typography variant="subtitle2" sx={{ mt: 3, mb: 2, color: '#d38236', fontWeight: 600 }}>
                FOLLOW US ON SOCIAL MEDIA
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  mt: 1 
                }}
                className="social-icons"
              >
                {[FacebookIcon, InstagramIcon, TwitterIcon].map((Icon, idx) => (
                  <IconButton 
                    key={idx}
                    className="social-icon-btn"
                    sx={{
                      backgroundColor: 'rgba(211, 130, 54, 0.15)',
                      color: '#d38236',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#d38236',
                        color: '#fff',
                        transform: 'translateY(-5px)'
                      }
                    }}
                  >
                    <Icon />
                  </IconButton>
                ))}
              </Box>
            </Paper>
          </Grid>
          
          {/* Contact Form */}
          <Grid item xs={12} md={7} className="form-section">
            <Paper 
              elevation={5} 
              sx={{ 
                p: 0, 
                backgroundColor: '#1A1A1A',
                borderRadius: '12px',
                border: '1px solid #333',
                overflow: 'hidden',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
                }
              }}
              className="contact-form-card"
            >
              <Box 
                sx={{ 
                  backgroundColor: '#d38236', 
                  p: 2, 
                  pl: 3,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#fff', 
                    fontWeight: 700,
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  SEND US A MESSAGE
                </Typography>
                
                <SportsBasketballIcon 
                  sx={{ 
                    color: 'rgba(255,255,255,0.2)', 
                    fontSize: 80,
                    position: 'absolute',
                    top: '-15px',
                    right: '-15px',
                    zIndex: 1,
                    transform: 'rotate(15deg)'
                  }}
                />
              </Box>
              
              <Box sx={{ p: 3, pt: 4, display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
                {submitted ? (
                  <Box 
                    className="success-message-container"
                    sx={{ 
                      p: 4,
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '12px',
                      background: 'radial-gradient(circle at top right, rgba(211, 130, 54, 0.2), transparent 70%)'
                    }}
                  >
                    <Box className="success-confetti"></Box>
                    
                    <Box 
                      className="success-content"
                      sx={{ 
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 5
                      }}
                    >
                      <Box 
                        className="success-icon-container" 
                        sx={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(211, 130, 54, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 24px',
                          position: 'relative',
                          animation: 'pulse 2s infinite'
                        }}
                      >
                        <CheckCircleIcon 
                          sx={{ 
                            fontSize: 44, 
                            color: '#d38236'
                          }} 
                        />
                      </Box>
                      
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          color: '#fff', 
                          mb: 2,
                          fontWeight: 700
                        }}
                        className="success-title"
                      >
                        Message Sent!
                      </Typography>
                      
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#bbb', 
                          mb: 4,
                          fontSize: '1.1rem',
                          maxWidth: '400px',
                          mx: 'auto',
                          lineHeight: 1.6
                        }}
                        className="success-message-text"
                      >
                        Thanks for reaching out. We'll get back to you as soon as possible.
                      </Typography>
                      
                      <Button 
                        variant="contained" 
                        onClick={() => setSubmitted(false)}
                        className="send-another-button"
                        sx={{ 
                          backgroundColor: '#d38236',
                          color: '#fff',
                          px: 4,
                          py: 1.5,
                          fontWeight: 600,
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(211, 130, 54, 0.3)',
                          '&:hover': {
                            backgroundColor: '#b06b2c',
                            transform: 'translateY(-3px)',
                            boxShadow: '0 6px 16px rgba(211, 130, 54, 0.4)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        SEND ANOTHER MESSAGE
                      </Button>
                    </Box>
                    
                    <SportsBasketballIcon 
                      className="bg-icon-1"
                      sx={{ 
                        color: 'rgba(211, 130, 54, 0.05)',
                        fontSize: 180,
                        position: 'absolute',
                        top: '-50px',
                        right: '-50px',
                        transform: 'rotate(15deg)',
                        zIndex: 1
                      }}
                    />
                    
                    <SportsSoccerIcon 
                      className="bg-icon-2"
                      sx={{ 
                        color: 'rgba(211, 130, 54, 0.05)',
                        fontSize: 140,
                        position: 'absolute',
                        bottom: '-40px',
                        left: '-40px',
                        transform: 'rotate(-10deg)',
                        zIndex: 1
                      }}
                    />
                  </Box>
                ) : (
                  <Box 
                    component="form" 
                    onSubmit={handleSubmit} 
                    noValidate 
                    className="contact-form"
                    sx={{
                      '& .MuiFormControl-root': {
                        mb: 2.5,
                      },
                      '& .MuiInputBase-root': {
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.08)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          boxShadow: '0 0 0 2px rgba(211, 130, 54, 0.25)',
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#aaa'
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#777',
                        opacity: 1
                      }
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          fullWidth
                          label="First Name"
                          name="first_name"
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon sx={{ color: '#d38236' }} />
                              </InputAdornment>
                            ),
                          }}
                          className="form-input"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          fullWidth
                          label="Last Name"
                          name="last_name"
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon sx={{ color: '#d38236' }} />
                              </InputAdornment>
                            ),
                          }}
                          className="form-input"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          variant="outlined"
                          error={!!emailError}
                          helperText={emailError}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon sx={{ color: '#d38236' }} />
                              </InputAdornment>
                            ),
                          }}
                          className="form-input"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phone_number"
                          variant="outlined"
                          error={!!phoneError}
                          helperText={phoneError}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon sx={{ color: '#d38236' }} />
                              </InputAdornment>
                            ),
                          }}
                          className="form-input"
                        />
                        {!phoneError && (
                          <FormHelperText sx={{ color: 'rgba(255,255,255,0.5)', ml: 2 }}>
                            Format: 09XXXXXXXXX or +639XXXXXXXX
                          </FormHelperText>
                        )}
                      </Grid>
                      {/* The Subject field is not in the backend API but we'll keep the UI intact */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Subject"
                          name="subject"
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SubjectIcon sx={{ color: '#d38236' }} />
                              </InputAdornment>
                            ),
                          }}
                          className="form-input"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          label="Message"
                          name="message_text"
                          multiline
                          rows={4}
                          variant="outlined"
                          className="form-input message-input"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          endIcon={<SendIcon />}
                          className="submit-button"
                          sx={{ 
                            mt: 2, 
                            mb: 1, 
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            backgroundColor: '#d38236',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                            '&:hover': {
                              backgroundColor: '#b06b2c',
                              transform: 'translateY(-3px)',
                              boxShadow: '0 6px 12px rgba(0,0,0,0.3)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          SEND MESSAGE
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Map Section */}
        <Box mt={8} className="map-section">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <LocationOnIcon sx={{ color: '#d38236', mr: 1, fontSize: 28 }} />
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{ 
                color: '#fff', 
                fontWeight: 700,
                m: 0
              }}
            >
              FIND US HERE
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              borderRadius: '12px', 
              overflow: 'hidden', 
              height: '400px',
              border: '1px solid #333',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
            className="map-container"
          >
            {/* Map header bar */}
            <Box sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '40px',
              background: 'linear-gradient(to right, #d38236, #b05e1d)',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              px: 2
            }}>
              <LocationOnIcon sx={{ color: '#fff', mr: 1 }} />
              <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
                STOP SHOT SPORTS BAR & KTV - MANDALUYONG
              </Typography>
            </Box>
            
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.421774913128!2d121.04219071038666!3d14.575026185849502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9459c58bcb7%3A0x563ad18fc323e83d!2sStop%20Shot%20Sports%20Bar%20%26%20KTV!5e0!3m2!1sen!2sph!4v1741402972614!5m2!1sen!2sph"
              width="100%"
              height="100%"
              style={{ border: 0, marginTop: '40px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="google-map"
            />
          </Box>
        </Box>
      </Container>
      
      {/* Snackbar notification */}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert 
          onClose={handleClose} 
          severity={isError ? "error" : "success"} 
          sx={{ 
            width: '100%', 
            backgroundColor: isError ? '#d32f2f' : '#2e7d32' 
          }}
        >
          {isError ? errorMessage : "Message sent! We will get back to you soon."}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;

// Add these missing components at the end of the file
const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);