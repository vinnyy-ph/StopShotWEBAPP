import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button,
  Container,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import { RiBilliardsFill } from "react-icons/ri";
import MicExternalOnIcon from '@mui/icons-material/MicExternalOn';
import ImageIcon from '@mui/icons-material/Image';
import '../styles/pages/homepage.css';

// Hero Slideshow Data
const slides = [
  {
    image: '/hero/billiards.png',
    title: 'BILLIARDS ARENA',
    subtitle: 'Pro tables, great drinks & epic battles with friends'
  },
  {
    image: '/hero/karaoke.png',
    title: 'PRIVATE KARAOKE',
    subtitle: 'Soundproof rooms with premium systems for the perfect night out'
  },
  {
    image: '/hero/bar.png',
    title: 'CRAFT COCKTAILS',
    subtitle: 'Signature drinks crafted by our expert mixologists'
  },
  {
    image: '/hero/outside.png',
    title: 'OUTDOOR VIBES',
    subtitle: 'Chill atmosphere for pre-game drinks and post-game celebrations'
  },
  {
    image: '/hero/show.png',
    title: 'LIVE SHOWS',
    subtitle: 'Watch fun shows and live events'
  },
];

// Menu item interface
interface MenuItem {
  menu_id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  image_url: string | null;
}

// Feedback interface
interface Feedback {
  feedback_id: number;
  user: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_num: string | null;
    role: string;
  };
  feedback_text: string;
  response_text: string | null;
  experience_rating: number;
  created_at: string;
  updated_at: string;
}

// Gallery images for atmosphere section
const atmosphereImages = [
  {
    url: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?q=80&w=2070&auto=format&fit=crop',
    title: 'Game Night'
  },
  {
    url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop',
    title: 'Bar Experience'
  },
  {
    url: 'https://images.unsplash.com/photo-1621252179027-9262f49856bc?q=80&w=1974&auto=format&fit=crop',
    title: 'Premium Cocktails'
  },
  {
    url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=2038&auto=format&fit=crop',
    title: 'Chill Space'
  },
];

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [menuHighlights, setMenuHighlights] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    // Animation trigger
    setIsVisible(true);

    // Fetch menu items for highlights
    fetchMenuHighlights();
    
    // Fetch feedback data
    fetchFeedback();

    return () => clearInterval(slideInterval);
  }, []);

  // Fetch menu items from API
  const fetchMenuHighlights = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/menus/list');
      
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      
      const data: MenuItem[] = await response.json();
      
      // Select a few featured items from different categories
      const categories = ['APPETIZERS', 'BEER', 'COCKTAILS'];
      const highlights = categories.map(category => {
        const categoryItems = data.filter(item => 
          item.category === category && item.is_available
        );
        // Return a random item from each category or the first one
        return categoryItems.length > 0 
          ? categoryItems[Math.floor(Math.random() * categoryItems.length)]
          : null;
      }).filter(item => item !== null) as MenuItem[];
      
      setMenuHighlights(highlights);
    } catch (error) {
      console.error('Error fetching menu data:', error);
      setError('Unable to load menu highlights. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch feedback data
  const fetchFeedback = async () => {
    try {
      setFeedbackLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/feedback/');
      
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }
      
      const data: Feedback[] = await response.json();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error fetching feedback data:', error);
      setFeedbackError('Unable to load customer feedback. Please try again later.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Format price to Philippine Peso
  const formatPrice = (price: string) => {
    return `₱${parseFloat(price).toFixed(2)}`;
  };

  // Manual controls
  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <Box className="homepage dark-mode">
      {/* ====== HERO SLIDESHOW SECTION ====== */}
      <Box className="slideshow-container">
        {slides.map((slide, index) => (
          <Box
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            sx={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Box className="overlay">
              <Typography 
                variant="h2" 
                className="slide-title"
                sx={{ 
                  fontWeight: 800, 
                  textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                  letterSpacing: '2px'
                }}
              >
                {slide.title}
              </Typography>
              <Typography 
                variant="h5" 
                className="slide-subtitle"
                sx={{ 
                  fontWeight: 400,
                  textShadow: '1px 1px 4px rgba(0,0,0,0.9)',
                  maxWidth: '800px'
                }}
              >
                {slide.subtitle}
              </Typography>
              <Button 
                variant="contained"
                size="large"
                href="/reservations"
                sx={{
                  mt: 4,
                  backgroundColor: '#d38236',
                  color: '#fff',
                  fontWeight: 'bold',
                  padding: '12px 30px',
                  fontSize: '1.1rem',
                  '&:hover': {
                    backgroundColor: '#b05e1d',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                RESERVE A TABLE
              </Button>
            </Box>
          </Box>
        ))}

        {/* Pagination & Arrows */}
        <Box className="pagination-dots">
          <IconButton 
            className="arrow arrow-left" 
            onClick={handlePrev}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.3)',
              '&:hover': { backgroundColor: 'rgba(211, 130, 54, 0.8)' }
            }}
          >
            <ArrowBackIosIcon fontSize="small" />
          </IconButton>

          {slides.map((_, index) => (
            <Box
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              sx={{
                backgroundColor: index === currentSlide ? '#d38236' : 'rgba(255,255,255,0.5)',
                width: index === currentSlide ? '14px' : '10px',
                height: index === currentSlide ? '14px' : '10px',
                transition: 'all 0.3s ease'
              }}
            />
          ))}

          <IconButton 
            className="arrow arrow-right" 
            onClick={handleNext}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.3)',
              '&:hover': { backgroundColor: 'rgba(211, 130, 54, 0.8)' }
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* ====== MAIN HOMEPAGE CONTENT ====== */}
      <Box className="home-content" sx={{ backgroundColor: '#121212', color: '#fff' }}>
        {/* Sports Icon Bar */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          py: 4, 
          backgroundColor: '#1a1a1a',
          borderBottom: '1px solid #333' 
        }}>
          <Container>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              {[
                { icon: <LocalBarIcon sx={{ fontSize: 36, color: '#d38236' }} />, label: "Premium Bar" },
                { icon: <MicExternalOnIcon sx={{ fontSize: 36, color: '#d38236' }} />, label: "Karaoke" },
                { icon: <RiBilliardsFill style={{ fontSize: 36, color: '#d38236' }} />, label: "Billiards" }
              ].map((item, index) => (
                <Grid item xs={6} sm={4} md={2} key={index} sx={{ textAlign: 'center' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'translateY(-5px)' }
                  }}>
                    {item.icon}
                    <Typography variant="subtitle2" sx={{ mt: 1, color: '#ccc', fontWeight: 500 }}>
                      {item.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Introduction / Welcome Section */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box className="intro-section" sx={{ 
            opacity: isVisible ? 1 : 0, 
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease'
          }}>
            <Typography 
              variant="h3" 
              className="section-title"
              sx={{ 
                textAlign: 'center', 
                mb: 2, 
                fontWeight: 700,
                backgroundImage: 'linear-gradient(45deg, #d38236, #ffc259)',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              YOUR ULTIMATE GO TO CHILL DESTINATION
            </Typography>
            <Typography 
              variant="h6" 
              className="section-subtitle"
              color="text.secondary"
              sx={{ 
                textAlign: 'center', 
                maxWidth: '800px', 
                mx: 'auto',
                mb: 4,
                color: '#aaa',
                fontWeight: 400
              }}
            >
              Live games. Cold drinks. Epic moments. Where fans become family.
            </Typography>
            <Box sx={{ 
              width: '60px', 
              height: '4px', 
              backgroundColor: '#d38236', 
              mx: 'auto',
              mb: 4
            }}/>
          </Box>

          {/* Featured Menu Items - Now uses API data */}
          <Box sx={{ mt: 8, mb: 10 }}>
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom
              sx={{ 
                textAlign: 'center', 
                fontWeight: 600,
                color: '#fff',
                mb: 4
              }}
            >
              GAME DAY <span style={{ color: '#d38236' }}>FAVORITES</span>
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress sx={{ color: '#d38236' }} />
              </Box>
            ) : error ? (
              <Typography color="error" align="center">{error}</Typography>
            ) : (
              <Grid container spacing={4}>
                {menuHighlights.map((item, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      backgroundColor: '#1E1E1E',
                      borderRadius: 2,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 10px 30px rgba(211, 130, 54, 0.2)'
                      }
                    }}>
                      <CardMedia
                        component="img"
                        height="260"
                        image={item.image_url || `https://placehold.co/600x400`}
                        alt={item.name}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Chip 
                              label={item.category} 
                              size="small" 
                              sx={{ 
                                backgroundColor: '#d38236', 
                                color: '#fff', 
                                mb: 1,
                                fontSize: '0.7rem'
                              }}
                            />
                            <Typography variant="h5" component="h3" sx={{ color: '#fff', fontWeight: 600 }}>
                              {item.name}
                            </Typography>
                          </Box>
                          <Typography variant="h6" sx={{ color: '#d38236', fontWeight: 700 }}>
                            {formatPrice(item.price)}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, color: '#bbb' }}>
                          {item.description || 'A delicious dish prepared by our expert chefs'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button 
                variant="outlined" 
                size="large" 
                component="a" 
                href="/menu"
                sx={{ 
                  borderColor: '#d38236', 
                  color: '#d38236',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: '#d38236',
                    backgroundColor: 'rgba(211, 130, 54, 0.1)'
                  }
                }}
              >
                VIEW FULL MENU
              </Button>
            </Box>
          </Box>

          {/* Divider */}
          <Divider sx={{ 
            borderColor: 'rgba(255,255,255,0.1)', 
            my: 6,
            '&::before, &::after': {
              borderColor: 'rgba(255,255,255,0.1)',
            }
          }}>
            <Chip 
              icon={<ImageIcon />} 
              label="THE VIBE" 
              sx={{ 
                backgroundColor: '#d38236', 
                color: 'white',
                px: 2,
                '& .MuiChip-icon': { color: 'white' } 
              }} 
            />
          </Divider>

          {/* Testimonials / Reviews Section - Dynamic Marquee */}
          <Box className="reviews-section" sx={{ 
            py: 6, 
            px: 3, 
            backgroundColor: 'rgba(211, 130, 54, 0.1)', 
            borderRadius: 2,
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(/backgrounds/fans.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mb: 8
          }}>
            <Typography 
              variant="h5" 
              className="section-title"
              sx={{ 
                textAlign: 'center',
                color: 'white',
                fontWeight: 600,
                mb: 4
              }}
            >
              WHAT OUR CUSTOMERS SAY
            </Typography>
            
            {feedbackLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress sx={{ color: '#d38236' }} />
              </Box>
            ) : feedbackError ? (
              <Typography color="error" align="center">{feedbackError}</Typography>
            ) : (
              <Box sx={{ 
                position: 'relative',
                overflow: 'hidden',
                '&::before, &::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  width: '50px',
                  height: '100%',
                  zIndex: 2,
                },
                '&::before': {
                  left: 0,
                  background: 'linear-gradient(to right, rgba(0,0,0,0.5), transparent)',
                },
                '&::after': {
                  right: 0,
                  background: 'linear-gradient(to left, rgba(0,0,0,0.5), transparent)',
                }
              }}>
                <Box 
                  sx={{ 
                    display: 'flex',
                    width: 'max-content', // This ensures all cards can be seen
                    gap: 3,
                    py: 2,
                    '@keyframes marquee': {
                      '0%': { transform: 'translateX(0)' },
                      '100%': { transform: `translateX(-${feedbacks.length * 350}px)` }
                    },
                    animation: feedbacks.length > 2 ? 'marquee 45s linear infinite' : 'none',
                    '&:hover': {
                      animationPlayState: 'paused'
                    }
                  }}
                >
                  {/* Display all testimonials twice to create seamless loop */}
                  {[...feedbacks, ...feedbacks].map((feedback, index) => (
                    <Box 
                      key={`${feedback.feedback_id}-${index}`}
                      sx={{ 
                        bgcolor: 'rgba(0,0,0,0.5)',
                        p: 3,
                        borderRadius: 2,
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        width: '320px',
                        height: '220px',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                        {Array(feedback.experience_rating).fill(0).map((_, i) => (
                          <Box 
                            key={i}
                            component="span" 
                            sx={{ 
                              color: '#d38236', 
                              fontSize: '18px', 
                              mr: 0.5 
                            }}
                          >
                            ★
                          </Box>
                        ))}
                      </Box>
                      <Typography 
                        variant="body1" 
                        className="review-text"
                        sx={{ 
                          fontStyle: 'italic',
                          color: '#eee',
                          flexGrow: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        "{feedback.feedback_text}"
                      </Typography>
                      <Typography 
                        variant="subtitle2" 
                        className="review-author"
                        sx={{ 
                          color: '#d38236',
                          mt: 2,
                          fontWeight: 500
                        }}
                      >
                        {feedback.user.first_name} {feedback.user.last_name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                
                <Typography 
                  variant="body2" 
                  align="center" 
                  sx={{ 
                    mt: 2, 
                    color: 'rgba(255,255,255,0.7)',
                    fontStyle: 'italic'
                  }}
                >
                  Hover to pause • {feedbacks.length} reviews from our guests
                </Typography>
              </Box>
            )}
          </Box>

          {/* Call-to-Action Section */}
          <Box className="reservation-cta-section" sx={{ textAlign: 'center', py: 8 }}>
            <Typography 
              variant="h3" 
              className="section-title"
              sx={{ 
                fontWeight: 700,
                mb: 2,
                color: 'white'
              }}
            >
              DON'T MISS THE ACTION
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#aaa',
                maxWidth: '800px',
                mx: 'auto',
                mb: 4
              }}
            >
              Reserve your spot for the big game, private karaoke room, or just a night out with friends.
            </Typography>
            <Button 
              variant="contained"
              size="large"
              href="/reservations"
              sx={{
                backgroundColor: '#d38236',
                color: 'white',
                fontWeight: 'bold',
                padding: '14px 40px',
                fontSize: '1.2rem',
                '&:hover': {
                  backgroundColor: '#b05e1d',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 16px rgba(211, 130, 54, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              RESERVE NOW
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;