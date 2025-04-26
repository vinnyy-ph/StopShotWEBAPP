import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper,
  TextField,
  Button,
  Rating,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
  Alert,
  Divider,
  Avatar,
  IconButton,
  InputAdornment,
  Tooltip,
  Zoom,
  Fade
} from '@mui/material';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import StarIcon from '@mui/icons-material/Star';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import '../styles/pages/feedback.css';

// Testimonial data for the marquee
const testimonials = [
  {
    id: 1,
    name: 'Michael J.',
    avatar: 'https://placehold.co/400x400/333/fff?text=MJ',
    rating: 5,
    text: 'Best place to watch NBA games! The atmosphere during playoffs is unbeatable.',
    date: 'March 15, 2025'
  },
  {
    id: 2,
    name: 'Sarah T.',
    avatar: 'https://placehold.co/400x400/333/fff?text=ST',
    rating: 4,
    text: 'Love the food selection and craft beer options. My go-to spot on weekends!',
    date: 'February 20, 2025'
  },
  {
    id: 3,
    name: 'David R.',
    avatar: 'https://placehold.co/400x400/333/fff?text=DR',
    rating: 5,
    text: 'The karaoke rooms are fantastic for private parties. Had an amazing birthday celebration here!',
    date: 'April 2, 2025'
  },
  {
    id: 4,
    name: 'Kimberly L.',
    avatar: 'https://placehold.co/400x400/333/fff?text=KL',
    rating: 5,
    text: 'Excellent service and the best chicken wings in town. Always my first choice for game nights.',
    date: 'January 10, 2025'
  },
  {
    id: 5,
    name: 'Jason M.',
    avatar: 'https://placehold.co/400x400/333/fff?text=JM',
    rating: 4,
    text: 'Great screens, great drinks, great vibe. What more could you ask for?',
    date: 'March 28, 2025'
  }
];

// Rating descriptions to explain what each star means
const ratingLabels = {
  1: 'Poor',
  2: 'Below Average',
  3: 'Good',
  4: 'Very Good', 
  5: 'Excellent'
};

// Labels for specific rating areas
const specificRatingAreas = {
  service: "Service Quality",
  food: "Food & Drinks",
  cleanliness: "Cleanliness",
  value: "Value for Money"
};

const FeedbackPage: React.FC = () => {
  // Primary rating state
  const [rating, setRating] = useState<number | null>(null);
  const [serviceRating, setServiceRating] = useState<number | null>(null);
  const [foodRating, setFoodRating] = useState<number | null>(null);
  const [cleanlinessRating, setCleanlinessRating] = useState<number | null>(null);
  const [valueRating, setValueRating] = useState<number | null>(null);
  
  const [visitFrequency, setVisitFrequency] = useState('');
  const [hoverRating, setHoverRating] = useState<number>(-1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  // Testimonial states
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('left');
  const testimonialRef = useRef<HTMLDivElement>(null);

  // Auto-rotate testimonials
  useEffect(() => {
    if (isPaused || isHovered) return;
    
    const interval = setInterval(() => {
      setAnimationDirection('left');
      setActiveTestimonialIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPaused, isHovered]);

  const handlePrevTestimonial = () => {
    setAnimationDirection('right');
    setActiveTestimonialIndex(prev => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNextTestimonial = () => {
    setAnimationDirection('left');
    setActiveTestimonialIndex(prev => 
      (prev + 1) % testimonials.length
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Form submission logic would go here
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Function to get label text for rating value
const getLabelText = (value: number) => {
  if (!value || !ratingLabels[value as keyof typeof ratingLabels]) {
    return 'Click to rate';
  }
  return `${value} Star${value !== 1 ? 's' : ''}, ${ratingLabels[value as keyof typeof ratingLabels]}`;
};

  return (
    <Box className="feedback-page" sx={{ backgroundColor: '#121212', pt: 2, pb: 10 }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Hero Section */}
        <Box 
          className="feedback-hero" 
          sx={{ 
            textAlign: 'center', 
            mb: 6,
            position: 'relative',
            overflow: 'hidden',
            pt: 2
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mb: 2
          }}>
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
                textShadow: '0px 2px 4px rgba(0,0,0,0.5)',
                m: 0
              }}
              className="feedback-title"
            >
              Game Day Feedback
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
            className="feedback-subtitle"
          >
            Your opinion is our MVP! Help us improve your game day experience.
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

        {/* Enhanced Testimonials Marquee Section */}
        <Box 
          className="testimonials-section"
          sx={{ 
            mb: 6, 
            position: 'relative',
            overflow: 'hidden', 
            borderRadius: '12px',
            backgroundColor: '#1a1a1a',
            boxShadow: '0px 8px 20px rgba(0,0,0,0.25)',
            border: '1px solid #333'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Header Bar */}
          <Box sx={{ 
            backgroundColor: '#d38236',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#fff', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <FormatQuoteIcon sx={{ mr: 1 }} /> WHAT OUR FANS ARE SAYING
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                onClick={() => setIsPaused(!isPaused)}
                size="small"
                sx={{ 
                  color: 'white', 
                  opacity: 0.8,
                  mr: 1,
                  '&:hover': {
                    opacity: 1,
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
              </IconButton>
              
              <Box sx={{ display: 'flex' }}>
                {testimonials.map((_, idx) => (
                  <Box 
                    key={idx}
                    onClick={() => setActiveTestimonialIndex(idx)}
                    sx={{ 
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      mx: 0.5,
                      backgroundColor: idx === activeTestimonialIndex ? '#fff' : 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Testimonials Slider with Navigation Controls */}
          <Box sx={{ 
            position: 'relative',
            height: '240px',
            overflow: 'hidden',
            backgroundColor: '#1a1a1a',
          }}>
            {/* Left Navigation Arrow */}
            <IconButton
              className="testimonial-nav-button"
              onClick={handlePrevTestimonial}
              sx={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                color: '#fff',
                backgroundColor: 'rgba(211, 130, 54, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(211, 130, 54, 0.5)',
                },
                m: 1,
                transition: 'all 0.3s ease',
                opacity: isHovered ? 1 : 0
              }}
            >
              <NavigateBeforeIcon fontSize="large" />
            </IconButton>
            
            {/* Right Navigation Arrow */}
            <IconButton
              className="testimonial-nav-button"
              onClick={handleNextTestimonial}
              sx={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                color: '#fff',
                backgroundColor: 'rgba(211, 130, 54, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(211, 130, 54, 0.5)',
                },
                m: 1,
                transition: 'all 0.3s ease',
                opacity: isHovered ? 1 : 0
              }}
            >
              <NavigateNextIcon fontSize="large" />
            </IconButton>
            
            <Box 
              ref={testimonialRef}
              className={`testimonials-container ${animationDirection === 'left' ? 'slide-left' : 'slide-right'}`}
              sx={{
                display: 'flex',
                transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: `translateX(-${activeTestimonialIndex * 100}%)`,
                height: '100%'
              }}
            >
              {testimonials.map((testimonial) => (
                <Box 
                  key={testimonial.id}
                  className="testimonial-slide"
                  sx={{ 
                    width: '100%',
                    minWidth: '100%',
                    p: 3,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'center', sm: 'flex-start' },
                    justifyContent: 'center',
                    gap: 3,
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Background ball icon - decorative */}
                  <SportsBasketballIcon 
                    sx={{ 
                      position: 'absolute',
                      color: 'rgba(211, 130, 54, 0.03)',
                      fontSize: '300px',
                      right: '-100px',
                      bottom: '-100px',
                      transform: 'rotate(-15deg)',
                      zIndex: 0
                    }}
                  />
                  
                  <Avatar 
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    sx={{ 
                      width: { xs: 80, md: 100 }, 
                      height: { xs: 80, md: 100 },
                      border: '3px solid #d38236',
                      boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
                      zIndex: 1
                    }}
                    className="testimonial-avatar"
                  />
                  <Box sx={{ 
                    flex: 1, 
                    textAlign: { xs: 'center', sm: 'left' }, 
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 1, 
                      justifyContent: { xs: 'center', sm: 'flex-start' },
                      flexWrap: 'wrap',
                      gap: 1
                    }}>
                      <Rating 
                        value={testimonial.rating} 
                        readOnly 
                        size="small" 
                        sx={{ 
                          color: '#d38236',
                          backgroundColor: 'rgba(0,0,0,0.2)',
                          borderRadius: '4px',
                          p: 0.5
                        }}
                      />
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#999',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          px: 1,
                          py: 0.5,
                          borderRadius: '4px',
                          ml: { xs: 0, sm: 1 },
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {testimonial.date}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#fff', 
                        fontWeight: 600,
                        mb: 1,
                        position: 'relative'
                      }}
                      className="testimonial-name"
                    >
                      {testimonial.name}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      className="testimonial-text"
                      sx={{ 
                        color: '#bbb',
                        fontStyle: 'italic',
                        position: 'relative',
                        pl: 2,
                        pr: 2,
                        pb: 1,
                        borderBottom: '1px dotted rgba(255,255,255,0.1)',
                        animation: 'fadeIn 0.5s ease'
                      }}
                    >
                      <FormatQuoteIcon 
                        sx={{ 
                          position: 'absolute',
                          left: -5,
                          top: -5,
                          color: 'rgba(211, 130, 54, 0.2)',
                          fontSize: '1.5rem'
                        }} 
                      />
                      {testimonial.text}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          
          {/* Progress bar */}
          <Box sx={{ 
            height: '4px', 
            width: '100%', 
            backgroundColor: 'rgba(255,255,255,0.1)',
            position: 'relative'
          }}>
            <Box 
              sx={{ 
                height: '100%', 
                backgroundColor: '#d38236',
                width: `${(1/testimonials.length) * 100}%`,
                position: 'absolute',
                left: `${(activeTestimonialIndex/testimonials.length) * 100}%`,
                transition: 'left 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </Box>
        </Box>

        {/* Feedback Form */}
        <Paper 
          elevation={5} 
          sx={{ 
            backgroundColor: '#1a1a1a',
            color: '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #333',
            backgroundImage: 'linear-gradient(rgba(40, 40, 40, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(40, 40, 40, 0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
          className="feedback-form-card"
        >
          <Box 
            sx={{ 
              backgroundColor: '#d38236', 
              p: 2, 
              pl: 3,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
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
              SHARE YOUR EXPERIENCE
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
          
          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            noValidate
            sx={{ p: 3, pt: 4 }}
            className="feedback-form"
          >
            <Grid container spacing={4}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    color: '#d38236',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <PersonOutlineIcon sx={{ mr: 1 }} /> Personal Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Full Name"
                      name="name"
                      variant="outlined"
                      className="dark-input"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineIcon sx={{ color: '#d38236' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
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
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      variant="outlined"
                      className="dark-input"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: '#d38236' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
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
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      variant="outlined"
                      className="dark-input"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: '#d38236' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
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
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl 
                      component="fieldset"
                      sx={{
                        '& .MuiFormLabel-root': {
                          color: '#aaa'
                        },
                        '& .MuiRadio-root': {
                          color: '#999'
                        },
                        '& .Mui-checked': {
                          color: '#d38236'
                        }
                      }}
                    >
                      <FormLabel component="legend">How often do you visit us?</FormLabel>
                      <RadioGroup
                        row
                        name="visitFrequency"
                        value={visitFrequency}
                        onChange={(e) => setVisitFrequency(e.target.value)}
                      >
                        <FormControlLabel value="first_time" control={<Radio />} label="First time" />
                        <FormControlLabel value="occasionally" control={<Radio />} label="Occasionally" />
                        <FormControlLabel value="regularly" control={<Radio />} label="Regularly" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              {/* Enhanced Rating Section */}
              <Grid item xs={12}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    color: '#d38236',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <StarIcon sx={{ mr: 1 }} /> Overall Experience
                </Typography>
                <Paper 
                  sx={{ 
                    p: 3, 
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 1
                  }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: '#fff',
                        fontWeight: 500,
                        mb: 1
                      }}
                    >
                      How would you rate your overall experience?
                    </Typography>
                    
                    <Rating
                      name="overall_rating"
                      value={rating}
                      precision={1}
                      size="large"
                      onChange={(event, newValue) => {
                        setRating(newValue);
                      }}
                      onChangeActive={(event, newHover) => {
                        setHoverRating(newHover);
                      }}
                      emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
                      sx={{ 
                        color: '#d38236',
                        fontSize: '2.5rem',
                        mb: 1,
                        '& .MuiRating-iconEmpty': {
                          color: 'rgba(211, 130, 54, 0.3)'
                        },
                        '& .MuiRating-iconFilled': {
                          filter: 'drop-shadow(0 0 2px rgba(211, 130, 54, 0.7))'
                        },
                        '& .MuiRating-iconHover': {
                          color: '#d38236',
                          transform: 'scale(1.2)',
                        }
                      }}
                    />
                    
                    {/* Rating label explanation */}
                    <Fade in={rating !== null || hoverRating !== -1}>
                      <Box
                        sx={{
                          mt: 1,
                          height: 24,
                          textAlign: 'center',
                          backgroundColor: 'rgba(211, 130, 54, 0.1)',
                          borderRadius: '4px',
                          px: 2,
                          py: 0.5,
                          border: '1px solid rgba(211, 130, 54, 0.2)',
                        }}
                      >
                        <Typography variant="body2" sx={{ color: '#d38236', fontWeight: 500 }}>
                          {
                            hoverRating !== -1
                              ? getLabelText(hoverRating)
                              : rating !== null
                              ? getLabelText(rating)
                              : 'Click to rate'
                          }
                        </Typography>
                      </Box>
                    </Fade>
                  </Box>
                </Paper>
              </Grid>

              {/* Improved Specific Feedback Areas */}
              <Grid item xs={12}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    color: '#d38236',
                    fontWeight: 600,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <StarIcon sx={{ mr: 1 }} /> Specific Feedback Areas
                </Typography>
                <Paper sx={{ 
                  backgroundColor: 'rgba(0,0,0,0.2)', 
                  p: 3, 
                  borderRadius: '8px', 
                  mb: 2,
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <Typography variant="body2" sx={{ color: '#aaa', mb: 3, fontStyle: 'italic' }}>
                    Please rate the following aspects of your experience to help us improve:
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box 
                        className="rating-item"
                        sx={{ 
                          p: 2,
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                          }
                        }}
                      >
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mb: 1
                          }}
                        >
                          <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                            {specificRatingAreas.service}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', pt: 1, pb: 1 }}>
                          <Rating 
                            name="service_rating" 
                            value={serviceRating} 
                            onChange={(event, newValue) => {
                              setServiceRating(newValue);
                            }}
                            sx={{ 
                              color: '#d38236',
                              '& .MuiRating-iconEmpty': {
                                color: 'rgba(211, 130, 54, 0.3)'
                              }
                            }}
                          />
                          {serviceRating ? (
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="caption" sx={{ color: '#bbb' }}>
                                {ratingLabels[serviceRating as keyof typeof ratingLabels]}
                              </Typography>
                            </Box>
                          ) : null}
                        </Box>
                      </Box>
                      
                      <Box 
                        className="rating-item"
                        sx={{ 
                          p: 2,
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          mt: 2,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                          }
                        }}
                      >
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mb: 1
                          }}
                        >
                          <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                            {specificRatingAreas.food}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', pt: 1, pb: 1 }}>
                          <Rating 
                            name="food_rating" 
                            value={foodRating} 
                            onChange={(event, newValue) => {
                              setFoodRating(newValue);
                            }}
                            sx={{ 
                              color: '#d38236',
                              '& .MuiRating-iconEmpty': {
                                color: 'rgba(211, 130, 54, 0.3)'
                              }
                            }}
                          />
                          {foodRating ? (
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="caption" sx={{ color: '#bbb' }}>
                                {ratingLabels[foodRating as keyof typeof ratingLabels]}
                              </Typography>
                            </Box>
                          ) : null}
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box 
                        className="rating-item"
                        sx={{ 
                          p: 2,
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                          }
                        }}
                      >
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mb: 1
                          }}
                        >
                          <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                            {specificRatingAreas.cleanliness}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', pt: 1, pb: 1 }}>
                          <Rating 
                            name="cleanliness_rating" 
                            value={cleanlinessRating} 
                            onChange={(event, newValue) => {
                              setCleanlinessRating(newValue);
                            }}
                            sx={{ 
                              color: '#d38236',
                              '& .MuiRating-iconEmpty': {
                                color: 'rgba(211, 130, 54, 0.3)'
                              }
                            }}
                          />
                          {cleanlinessRating ? (
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="caption" sx={{ color: '#bbb' }}>
                                {ratingLabels[cleanlinessRating as keyof typeof ratingLabels]}
                              </Typography>
                            </Box>
                          ) : null}
                        </Box>
                      </Box>
                      
                      <Box 
                        className="rating-item"
                        sx={{ 
                          p: 2,
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          mt: 2,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                          }
                        }}
                      >
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mb: 1
                          }}
                        >
                          <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                            {specificRatingAreas.value}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', pt: 1, pb: 1 }}>
                          <Rating 
                            name="value_rating" 
                            value={valueRating} 
                            onChange={(event, newValue) => {
                              setValueRating(newValue);
                            }}
                            sx={{ 
                              color: '#d38236',
                              '& .MuiRating-iconEmpty': {
                                color: 'rgba(211, 130, 54, 0.3)'
                              }
                            }}
                          />
                          {valueRating ? (
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="caption" sx={{ color: '#bbb' }}>
                                {ratingLabels[valueRating as keyof typeof ratingLabels]}
                              </Typography>
                            </Box>
                          ) : null}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Comments */}
              <Grid item xs={12}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    color: '#d38236',
                    fontWeight: 600,
                  }}
                >
                  Additional Comments
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Please share any additional feedback or suggestions"
                  name="comments"
                  variant="outlined"
                  className="dark-input message-input"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      color: '#fff',
                      borderLeft: '3px solid #d38236',
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
                    }
                  }}
                />
              </Grid>

              {/* Recommendation */}
              <Grid item xs={12}>
                <FormControl 
                  component="fieldset"
                  sx={{
                    '& .MuiFormLabel-root': {
                      color: '#aaa'
                    },
                    '& .MuiRadio-root': {
                      color: '#999'
                    },
                    '& .Mui-checked': {
                      color: '#d38236'
                    },
                    p: 2,
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <FormLabel component="legend">Would you recommend us to a friend?</FormLabel>
                  <RadioGroup row name="recommendation">
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                    <FormControlLabel value="maybe" control={<Radio />} label="Maybe" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  endIcon={<SendIcon />}
                  className="submit-button"
                  sx={{ 
                    py: 1.5, 
                    backgroundColor: '#d38236',
                    fontWeight: 600,
                    fontSize: '1rem',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: '#b06b2c',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 12px rgba(0,0,0,0.3)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Submit Feedback
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert 
            onClose={handleCloseSnackbar} 
            severity="success" 
            sx={{ 
              width: '100%', 
              backgroundColor: 'rgba(46, 125, 50, 0.9)',
              color: '#fff',
              '& .MuiAlert-icon': {
                color: '#fff'
              }
            }}
          >
            Thank you for your feedback! We appreciate your input.
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default FeedbackPage;