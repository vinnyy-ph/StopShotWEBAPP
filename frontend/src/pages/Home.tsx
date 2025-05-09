// src/pages/HomePage.tsx
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
  Divider
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import { RiBilliardsFill } from "react-icons/ri";
import MicExternalOnIcon from '@mui/icons-material/MicExternalOn';
import EventIcon from '@mui/icons-material/Event';
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
    title: 'LIVE GAME NIGHTS',
    subtitle: 'Watch major sporting events on our massive HD screens'
  },
];

// Upcoming Events
const upcomingEvents = [
  {
    title: "NBA Finals Watch Party",
    date: "June 15, 2025",
    description: "Join us for the ultimate basketball showdown with special drink promos throughout the game!",
    image: "https://placehold.co/600x400"
  },
  {
    title: "Karaoke Championship",
    date: "June 20, 2025", 
    description: "Show off your vocal talents and compete for prizes. Entry includes one free signature cocktail!",
    image: "https://placehold.co/600x400"
  },
  {
    title: "UFC Fight Night",
    date: "June 25, 2025",
    description: "Experience the intensity of UFC fights on our big screens with exclusive beer bucket deals!",
    image: "https://placehold.co/600x400" 
  }
];

// Menu highlights
const menuHighlights = [
  {
    name: "The Slam Dunk",
    category: "Signature Cocktail",
    price: "$12",
    description: "Bourbon, orange bitters, maple syrup, and a flaming orange peel",
    image: "https://placehold.co/600x400"
  },
  {
    name: "Loaded Nachos Supreme",
    category: "Fan Favorite",
    price: "$14",
    description: "Crispy tortilla chips smothered in cheese, jalapeños, guacamole, and pulled pork",
    image: "https://placehold.co/600x400"
  },
  {
    name: "Championship Wings",
    category: "Game Day Special",
    price: "$16",
    description: "Choose from 6 signature sauces - from mild to 'challenge the ref' hot",
    image: "https://placehold.co/600x400"
  }
];

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    // Animation trigger
    setIsVisible(true);

    return () => clearInterval(slideInterval);
  }, []);

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

          {/* Featured Menu Items */}
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
                      height="200"
                      image={item.image || `https://placehold.co/600x400`}
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
                          {item.price}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, color: '#bbb' }}>
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
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
              icon={<EventIcon />} 
              label="UPCOMING EVENTS" 
              sx={{ 
                backgroundColor: '#d38236', 
                color: 'white',
                px: 2,
                '& .MuiChip-icon': { color: 'white' } 
              }} 
            />
          </Divider>

          {/* Events & Promotions Section */}
          <Box className="events-promos-section" sx={{ mb: 8 }}>
            <Grid container spacing={3}>
              {upcomingEvents.map((event, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ 
                    backgroundColor: '#222', 
                    height: '100%',
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={event.image || `https://source.unsplash.com/400x200/?${event.title.toLowerCase().replace(' ','-')}`}
                      alt={event.title}
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Typography 
                        gutterBottom 
                        variant="h6" 
                        component="h3"
                        sx={{ color: 'white', fontWeight: 600 }}
                      >
                        {event.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EventIcon sx={{ color: '#d38236', mr: 1, fontSize: 18 }} />
                        <Typography variant="subtitle2" sx={{ color: '#d38236' }}>
                          {event.date}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#bbb' }}>
                        {event.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Testimonials / Reviews Section */}
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
              WHAT OUR FANS SAY
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              {[
                {
                  text: "The atmosphere during the playoffs is electric! Best screens in the city and the wing specials are incredible.",
                  author: "Mike R., Regular since 2021"
                },
                {
                  text: "My go-to spot for watching UFC fights. Great crowd, amazing cocktails, and the staff really know their sports.",
                  author: "Sarah K., Fight Night Fan"
                },
                {
                  text: "The private karaoke rooms are perfect for birthdays. We had a blast singing and the drink service was on point!",
                  author: "David L., Celebration Expert"
                }
              ].map((review, idx) => (
                <Grid item xs={12} md={4} key={idx}>
                  <Box sx={{ 
                    bgcolor: 'rgba(0,0,0,0.5)',
                    p: 3,
                    borderRadius: 2,
                    height: '100%',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Typography 
                      variant="body1" 
                      className="review-text"
                      sx={{ 
                        fontStyle: 'italic',
                        color: '#eee',
                        flexGrow: 1
                      }}
                    >
                      "{review.text}"
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
                      {review.author}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
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